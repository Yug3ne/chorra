import { useWhiteboardStore } from "../store/whiteboard";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export const SheetSwitcher = () => {
  const { sheets, activeSheetId, setActiveSheet, setShowSheetSwitcher, showSheetSwitcher } =
    useWhiteboardStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sheets by search query
  const filteredSheets = useMemo(() => {
    return sheets.filter((sheet) =>
      sheet.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sheets, searchQuery]);

  const handleSelectSheet = (sheetId: string) => {
    setActiveSheet(sheetId);
    setShowSheetSwitcher(false);
    setSearchQuery("");
  };

  const handleOpenChange = (open: boolean) => {
    setShowSheetSwitcher(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  return (
    <Dialog open={showSheetSwitcher} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Sheet</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="pl-9"
          />
        </div>

        {/* Sheet List */}
        <ScrollArea className="h-80">
          {filteredSheets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No sheets found
            </div>
          ) : (
            <div className="space-y-1 pr-4">
              {filteredSheets.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => handleSelectSheet(sheet.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                    activeSheetId === sheet.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-accent text-foreground"
                  }`}
                >
                  <p className="font-medium">{sheet.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(sheet.updatedAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
