import { useQuery, useMutation } from "convex/react";
import { useWhiteboardStore } from "../store/whiteboard";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Trash2, Plus } from "lucide-react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export const Sidebar = () => {
  const {
    activeSheetId,
    sheets,
    setActiveSheet,
    addSheet,
    removeSheet,
    updateSheets,
  } = useWhiteboardStore();

  // Fetch sheets from Convex
  const sheetsData = useQuery(api.sheets.listSheets);
  const createSheetMutation = useMutation(api.sheets.createSheet);
  const deleteSheetMutation = useMutation(api.sheets.deleteSheet);

  // Update store when sheets data changes
  useEffect(() => {
    if (sheetsData) {
      updateSheets(sheetsData);
    }
  }, [sheetsData, updateSheets]);

  // Auto-select first sheet if none selected
  useEffect(() => {
    if (!activeSheetId && sheets.length > 0) {
      setActiveSheet(sheets[0].id);
    }
  }, [sheets, activeSheetId, setActiveSheet]);

  const handleCreateSheet = async () => {
    try {
      const newSheet = await createSheetMutation();
      addSheet({
        id: newSheet.id,
        title: newSheet.title,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });
      setActiveSheet(newSheet.id);
    } catch (error) {
      console.error("Failed to create sheet:", error);
    }
  };

  const handleDeleteSheet = async (
    e: React.MouseEvent,
    sheetId: string
  ) => {
    e.stopPropagation();
    try {
      await deleteSheetMutation({ sheetId: sheetId as any });
      removeSheet(sheetId);
    } catch (error) {
      console.error("Failed to delete sheet:", error);
    }
  };

  const formatLastUpdated = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Whiteboard</h1>
      </div>

      {/* Create New Sheet */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={handleCreateSheet}
          className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground flex items-center gap-2"
          size="sm"
        >
          <Plus size={16} />
          New Sheet
        </Button>
      </div>

      {/* Sheet List */}
      <ScrollArea className="flex-1">
        {sheets.length === 0 ? (
          <div className="p-4 text-center text-sidebar-foreground/60 text-sm">
            No sheets yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sheets.map((sheet) => (
              <div key={sheet.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveSheet(sheet.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center justify-between group ${
                        activeSheetId === sheet.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{sheet.title}</p>
                        <p className="text-xs text-sidebar-foreground/60">
                          {formatLastUpdated(sheet.updatedAt)}
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => handleDeleteSheet(e, sheet.id)}
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-sidebar-foreground/40 hover:text-destructive p-1 rounded hover:bg-destructive/10"
                            title="Delete sheet"
                          >
                            <Trash2 size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          Delete sheet
                        </TooltipContent>
                      </Tooltip>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {sheet.title}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
