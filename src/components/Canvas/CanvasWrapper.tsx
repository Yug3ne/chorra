import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useSheetSync } from "../../lib/hooks/useSheetSync";
import { SaveIndicator } from "../SaveIndicator";
import { Loader2 } from "lucide-react";
import { useRef, useEffect, useMemo } from "react";
import { useTheme } from "../theme-provider";
import type { ExcalidrawElement, ExcalidrawAppState } from "../../types/excalidraw";

interface CanvasWrapperProps {
  sheetId: string;
}

interface SheetResult {
  elements: unknown[];
  appState: unknown;
}

function buildInitialData(sheetData: SheetResult) {
  return {
    elements: (sheetData.elements ?? []) as ExcalidrawElement[],
    appState: ({
      zoom: { value: 1 },
      scrollX: 0,
      scrollY: 0,
      ...(typeof sheetData.appState === "object" && sheetData.appState !== null
        ? (sheetData.appState as Record<string, unknown>)
        : {}),
    }) as ExcalidrawAppState,
  };
}

export const CanvasWrapper = ({ sheetId }: CanvasWrapperProps) => {
  const { data: sheetData, isPending } = useQuery(
    convexQuery(api.sheets.getSheet, { sheetId: sheetId as any })
  );
  const excalidrawContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const resolvedTheme = useMemo(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme]);

  const { onElementsChange } = useSheetSync(sheetId);

  useEffect(() => {
    if (excalidrawContainerRef.current) {
      const excalidrawCanvas = excalidrawContainerRef.current.querySelector("canvas");
      if (excalidrawCanvas) {
        excalidrawCanvas.focus();
      }
    }
  }, [sheetId, sheetData]);

  if (isPending || !sheetData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-foreground/60">Loading canvas...</p>
        </div>
      </div>
    );
  }

  const initialData = buildInitialData(sheetData as SheetResult);

  return (
    <div className="flex-1 flex flex-col w-full h-full">
      <div style={{ flex: 1, width: "100%", height: "100%" }} ref={excalidrawContainerRef}>
        <Excalidraw
          initialData={initialData as any}
          onChange={(elements, appState) => {
            onElementsChange(elements as unknown as ExcalidrawElement[], appState as unknown as ExcalidrawAppState);
          }}
          theme={resolvedTheme}
        />
      </div>
      <SaveIndicator />
    </div>
  );
};
