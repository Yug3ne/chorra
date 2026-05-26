import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import { useWhiteboardStore } from "../../store/whiteboard";
import { SyncEngine } from "../syncEngine";
import { sanitizeForConvex, filterAppStateForConvex } from "../sanitizeForConvex";
import type { ExcalidrawElement, ExcalidrawAppState } from "../../types/excalidraw";

export const useSheetSync = (sheetId: string) => {
  const updateSheetMutation = useMutation(api.sheets.updateSheet);
  const { setSaving } = useWhiteboardStore();
  const syncEngineRef = useRef<SyncEngine | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveStartTimeRef = useRef<number | null>(null);
  const showIndicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const syncEngine = new SyncEngine(
      async (data) => {
        saveStartTimeRef.current = Date.now();
        setIsSaving(false); // Reset in case of rapid saves
        
        // Show indicator only if save takes > 300ms
        showIndicatorTimeoutRef.current = setTimeout(() => {
          setIsSaving(true);
        }, 300);

        try {
          await updateSheetMutation({
            sheetId: sheetId as any,
            elements: sanitizeForConvex(data.elements) as any,
            appState: filterAppStateForConvex(data.appState),
          });
        } catch (error) {
          console.error("Failed to save sheet:", error);
          setIsSaving(false); // Clear on error
        } finally {
          if (showIndicatorTimeoutRef.current) {
            clearTimeout(showIndicatorTimeoutRef.current);
          }
          setIsSaving(false);
        }
      },
      { debounceMs: 2000 } // Increased from 1000ms to 2000ms (2 seconds)
    );

    syncEngineRef.current = syncEngine;

    return () => {
      syncEngine.cancel();
      syncEngineRef.current = null;
      if (showIndicatorTimeoutRef.current) {
        clearTimeout(showIndicatorTimeoutRef.current);
      }
    };
  }, [sheetId, updateSheetMutation, setSaving]);

  // Update setSaving in store when local isSaving state changes
  useEffect(() => {
    setSaving(isSaving);
  }, [isSaving, setSaving]);

  const onElementsChange = (elements: ExcalidrawElement[], appState: ExcalidrawAppState) => {
    if (syncEngineRef.current) {
      syncEngineRef.current.onCanvasChange(elements, appState);
    }
  };

  return { onElementsChange };
};
