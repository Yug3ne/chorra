import { ConvexProvider, ConvexReactClient } from "convex/react";
import { TooltipProvider } from "./components/ui/tooltip";
import { MainLayout } from "./components/layout/MainLayout";
import { SheetSwitcher } from "./components/SheetSwitcher";
import { useKeyboardShortcuts } from "./lib/hooks/useKeyboardShortcuts";
import { ThemeProvider } from "./components/theme-provider";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || "http://localhost:3210"
);

const AppContent = () => {
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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </ConvexProvider>
  );
};

export default App;
