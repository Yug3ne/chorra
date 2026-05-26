import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useSheetSync } from "../../lib/hooks/useSheetSync";
import { SaveIndicator } from "../SaveIndicator";
import { Loader2 } from "lucide-react";

interface CanvasWrapperProps {
  sheetId: string;
}

export const CanvasWrapper = ({ sheetId }: CanvasWrapperProps) => {
  const sheetData = useQuery(api.sheets.getSheet, { sheetId: sheetId as any });

  // Use the sync hook to handle debounced saves
  const { onElementsChange } = useSheetSync(sheetId);

  // Handle loading state
  if (!sheetData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading canvas...</p>
        </div>
      </div>
    );
  }

  const initialData = {
    elements: (sheetData.elements || []) as any[],
    appState: (sheetData.appState || {
      zoom: { value: 1 },
      scrollX: 0,
      scrollY: 0,
    }) as any,
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full">
      <div style={{ flex: 1, width: "100%", height: "100%" }}>
        <Excalidraw
          initialData={initialData as any}
          onChange={(elements: any, appState: any) => {
            onElementsChange(elements, appState);
          }}
          theme="dark"
        />
      </div>
      <SaveIndicator />
    </div>
  );
};
