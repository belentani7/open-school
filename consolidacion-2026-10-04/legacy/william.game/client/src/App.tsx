import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

/** Belentani//OS: el marco React solo contiene el juego; la experiencia vive en Home. */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Home />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
