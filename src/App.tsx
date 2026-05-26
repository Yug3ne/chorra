import { ConvexProvider, ConvexReactClient } from "convex/react";
import { TooltipProvider } from "./components/ui/tooltip";
import { MainLayout } from "./components/layout/MainLayout";
import { SheetSwitcher } from "./components/SheetSwitcher";
import { useKeyboardShortcuts } from "./lib/hooks/useKeyboardShortcuts";
import { useEffect } from "react";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || "http://localhost:3210"
);

const AppContent = () => {
  // Set dark mode by default
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("dark")) {
      html.classList.add("dark");
    }
  }, []);

  useKeyboardShortcuts();

  return (
    <TooltipProvider>
      <MainLayout />
      <SheetSwitcher />
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <ConvexProvider client={convex}>
      <AppContent />
    </ConvexProvider>
  );
};

export default App;
