import { TooltipProvider } from "./components/ui/tooltip";
import { MainLayout } from "./components/layout/MainLayout";
import { SheetSwitcher } from "./components/SheetSwitcher";
import { useKeyboardShortcuts } from "./lib/hooks/useKeyboardShortcuts";
import { ThemeProvider } from "./components/theme-provider";
import { ConvexClientProvider } from "./components/ConvexClientProvider";
import { AuthGuard } from "./components/AuthGuard";

const AppContent = () => {
  useKeyboardShortcuts();

  return (
    <AuthGuard>
      <TooltipProvider>
        <MainLayout />
        <SheetSwitcher />
      </TooltipProvider>
    </AuthGuard>
  );
};

const App = () => {
  return (
    <ConvexClientProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </ConvexClientProvider>
  );
};

export default App;
