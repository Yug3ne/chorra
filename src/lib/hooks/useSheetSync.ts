import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";
import { useWhiteboardStore } from "../../store/whiteboard";
import { SyncEngine } from "../syncEngine";
import { sanitizeForConvex } from "../sanitizeForConvex";

export const useSheetSync = (sheetId: string) => {
  const updateSheetMutation = useMutation(api.sheets.updateSheet);
  const { setSaving } = useWhiteboardStore();
  const syncEngineRef = useRef<SyncEngine | null>(null);

  // Initialize sync engine
  useEffect(() => {
    const syncEngine = new SyncEngine(async (data) => {
      setSaving(true);
      try {
        await updateSheetMutation({
          sheetId: sheetId as any,
          elements: sanitizeForConvex(data.elements) as any,
          appState: sanitizeForConvex(data.appState),
        });
      } catch (error) {
        console.error("Failed to save sheet:", error);
      } finally {
        setSaving(false);
      }
    });

    syncEngineRef.current = syncEngine;

    // Cleanup on unmount
    return () => {
      syncEngine.cancel();
      syncEngineRef.current = null;
    };
  }, [sheetId, updateSheetMutation, setSaving]);

  // Handle sheet changes
  const onElementsChange = (elements: any[], appState: any) => {
    if (syncEngineRef.current) {
      syncEngineRef.current.onCanvasChange(elements, appState);
    }
  };

  return { onElementsChange };
};
