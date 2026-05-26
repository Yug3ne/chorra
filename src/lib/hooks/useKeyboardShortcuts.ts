import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWhiteboardStore } from "../../store/whiteboard";

export const useKeyboardShortcuts = () => {
  const createSheetMutation = useMutation(api.sheets.createSheet);
  const { addSheet, setActiveSheet, setShowSheetSwitcher, showSheetSwitcher } =
    useWhiteboardStore();

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Cmd+N or Ctrl+N: Create new sheet
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
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
      }

      // Cmd+K or Ctrl+K: Toggle sheet switcher
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSheetSwitcher(!showSheetSwitcher);
      }

      // Escape: Close sheet switcher
      if (e.key === "Escape" && showSheetSwitcher) {
        setShowSheetSwitcher(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [createSheetMutation, addSheet, setActiveSheet, setShowSheetSwitcher, showSheetSwitcher]);
};
