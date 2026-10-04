import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
const Admin = lazy(() => import("@/pages/Admin"));
const Method = lazy(() => import("@/pages/Method"));
const Blog = lazy(() => import("@/pages/Blog"));
const Press = lazy(() => import("@/pages/Press"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<div className="route-loading" role="status">Cargando…</div>}>
      <Switch>
        <Route path={"/"} component={Home} />
      <Route path={"/gestion"} component={Admin} />
      <Route path={"/metodo"} component={Method} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/prensa"} component={Press} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
