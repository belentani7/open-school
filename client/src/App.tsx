// Open School - Main App Component (wouter v3)
import { Switch, Route } from "wouter";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { CourseDetail } from "./pages/CourseDetail";
import { NotFound } from "./pages/NotFound";
import { Chat } from "./pages/Chat";
import { Catalog } from "./pages/Catalog";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/chat" component={Chat} />
          <Route path="/courses/:id" component={CourseDetail} />
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </ThemeProvider>
  );
}
