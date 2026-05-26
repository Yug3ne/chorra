import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";
import { useWhiteboardStore } from "../../store/whiteboard";
import { SyncEngine } from "../syncEngine";
import { sanitizeForConvex } from "../sanitizeForConvex";
import type { ExcalidrawElement, ExcalidrawAppState } from "../../types/excalidraw";

export const useSheetSync = (sheetId: string) => {
  const updateSheetMutation = useMutation(api.sheets.updateSheet);
  const { setSaving } = useWhiteboardStore();
  const syncEngineRef = useRef<SyncEngine | null>(null);

  useEffect(() => {
    const syncEngine = new SyncEngine(async (data) => {
      setSaving(true);
      try {
        await updateSheetMutation({
          sheetId: sheetId as any,
          elements: sanitizeForConvex(data.elements) as any,
          appState: sanitizeForConvex(data.appState) as any,
        });
      } catch (error) {
        console.error("Failed to save sheet:", error);
      } finally {
        setSaving(false);
      }
    });

    syncEngineRef.current = syncEngine;

    return () => {
      syncEngine.cancel();
      syncEngineRef.current = null;
    };
  }, [sheetId, updateSheetMutation, setSaving]);

  const onElementsChange = (elements: ExcalidrawElement[], appState: ExcalidrawAppState) => {
    if (syncEngineRef.current) {
      syncEngineRef.current.onCanvasChange(elements, appState);
    }
  };

  return { onElementsChange };
};
