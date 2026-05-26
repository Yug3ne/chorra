import { useWhiteboardStore } from "../store/whiteboard";
import { CheckCircle, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const SaveIndicator = () => {
  const isSaving = useWhiteboardStore((state) => state.isSaving);

  if (!isSaving) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="px-3 py-2 bg-card border border-border shadow-md flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 size={16} className="text-primary animate-spin" />
                <span className="text-sm text-foreground font-medium">Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-foreground">Saved</span>
              </>
            )}
          </Card>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs">
          {isSaving ? "Syncing to database..." : "All changes saved"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
