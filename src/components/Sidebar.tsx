import { useQuery, useMutation } from "convex/react";
import { useWhiteboardStore } from "../store/whiteboard";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Trash2, Plus, ChevronLeft, ChevronRight, Edit2, Check, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export const Sidebar = () => {
  const {
    activeSheetId,
    sheets,
    setActiveSheet,
    addSheet,
    removeSheet,
    updateSheets,
    sidebarOpen,
    setSidebarOpen,
    sidebarWidth,
    setSidebarWidth,
    editingSheetId,
    setEditingSheetId,
    updateSheetTitle,
  } = useWhiteboardStore();

  const [renamingValue, setRenamingValue] = useState("");

  // Fetch sheets from Convex
  const sheetsData = useQuery(api.sheets.listSheets);
  const createSheetMutation = useMutation(api.sheets.createSheet);
  const deleteSheetMutation = useMutation(api.sheets.deleteSheet);
  const renameSheetMutation = useMutation(api.sheets.renameSheet);

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

  const handleRenameStart = (e: React.MouseEvent, sheetId: string) => {
    e.stopPropagation();
    const sheet = sheets.find((s) => s.id === sheetId);
    if (sheet) {
      setEditingSheetId(sheetId);
      setRenamingValue(sheet.title);
    }
  };

  const handleRenameEnd = async (sheetId: string, newTitle: string) => {
    if (newTitle.trim() && newTitle !== sheets.find((s) => s.id === sheetId)?.title) {
      try {
        await renameSheetMutation({
          sheetId: sheetId as any,
          newTitle: newTitle.trim(),
        });
        updateSheetTitle(sheetId, newTitle.trim());
      } catch (error) {
        console.error("Failed to rename sheet:", error);
      }
    }
    setEditingSheetId(null);
    setRenamingValue("");
  };

  const handleRenameCancel = () => {
    setEditingSheetId(null);
    setRenamingValue("");
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, sheetId: string) => {
    if (e.key === "Enter") {
      handleRenameEnd(sheetId, renamingValue);
    } else if (e.key === "Escape") {
      handleRenameCancel();
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

  if (!sidebarOpen) {
    return (
      <div className="w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Expand sidebar</TooltipContent>
        </Tooltip>
        <div className="mt-auto">
          <ModeToggle />
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-sidebar border-r border-sidebar-border flex flex-col h-screen group"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Header with collapse button */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <h1 className="text-xl font-bold text-sidebar-foreground">Whiteboard</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Collapse sidebar</TooltipContent>
        </Tooltip>
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
                {editingSheetId === sheet.id ? (
                  // Edit mode
                  <div className="flex gap-2 px-3 py-2 bg-sidebar-accent/50 rounded-md">
                    <input
                      autoFocus
                      type="text"
                      value={renamingValue}
                      onChange={(e) => setRenamingValue(e.target.value)}
                      onKeyDown={(e) => handleRenameKeyDown(e, sheet.id)}
                      className="flex-1 bg-background text-foreground px-2 py-1 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => handleRenameEnd(sheet.id, renamingValue)}
                      className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={handleRenameCancel}
                      className="p-1 text-sidebar-foreground/60 hover:text-destructive rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  // Normal mode
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
                        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => handleRenameStart(e, sheet.id)}
                                className="text-sidebar-foreground/40 hover:text-primary p-1 rounded hover:bg-primary/10 transition-colors"
                                title="Rename sheet"
                              >
                                <Edit2 size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                              Rename sheet (or double-click)
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => handleDeleteSheet(e, sheet.id)}
                                className="text-sidebar-foreground/40 hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors"
                                title="Delete sheet"
                              >
                                <Trash2 size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs">
                              Delete sheet
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {sheet.title}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <ModeToggle />
      </div>

      {/* Resize handle */}
      <div
        className="absolute top-0 right-0 w-1 h-full bg-sidebar-border hover:bg-primary cursor-col-resize opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startWidth = sidebarWidth;

          const handleMouseMove = (moveEvent: MouseEvent) => {
            const diff = moveEvent.clientX - startX;
            const newWidth = Math.max(200, Math.min(600, startWidth + diff));
            setSidebarWidth(newWidth);
          };

          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
        style={{ cursor: "col-resize" }}
      />
    </div>
  );
};
