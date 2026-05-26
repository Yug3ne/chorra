import { Sidebar } from "../Sidebar";
import { CanvasWrapper } from "../Canvas/CanvasWrapper";
import { useWhiteboardStore } from "../../store/whiteboard";

export const MainLayout = () => {
  const activeSheetId = useWhiteboardStore((state) => state.activeSheetId);
  const sidebarOpen = useWhiteboardStore((state) => state.sidebarOpen);
  const sidebarWidth = useWhiteboardStore((state) => state.sidebarWidth);

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Sidebar with dynamic width */}
      <div style={{ width: sidebarOpen ? `${sidebarWidth}px` : "48px" }}>
        <Sidebar />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {activeSheetId ? (
          <CanvasWrapper key={activeSheetId} sheetId={activeSheetId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <p className="text-foreground/60 mb-4">No sheet selected</p>
              <p className="text-sm text-foreground/40">
                Create a new sheet or select one from the sidebar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
