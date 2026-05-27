import { useWhiteboardStore } from "../store/whiteboard";
import { Check, Loader2 } from "lucide-react";

export const SaveIndicator = () => {
  const isSaving = useWhiteboardStore((state) => state.isSaving);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isSaving ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm">
        {isSaving ? (
          <>
            <Loader2 size={14} className="text-primary animate-spin flex-shrink-0" />
            <span className="text-xs text-foreground/70 font-medium">Saving...</span>
          </>
        ) : (
          <>
            <Check size={14} className="text-green-600 flex-shrink-0" />
            <span className="text-xs text-foreground/70">Saved</span>
          </>
        )}
      </div>
    </div>
  );
};
