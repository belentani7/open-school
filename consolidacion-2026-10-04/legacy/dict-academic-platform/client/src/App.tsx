import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CourseDetail from "./pages/CourseDetail";
import Curriculum from "./pages/Curriculum";
import Library from "./pages/Library";
import StudentDashboard from "./pages/StudentDashboard";
import TutorPage from "./pages/TutorPage";
import AcademicRecord from "./pages/AcademicRecord";
import Labs from "./pages/Labs";
import CertificateVerify from "./pages/CertificateVerify";
import StudentProfile from "./pages/StudentProfile";
import PublicPortfolio from "./pages/PublicPortfolio";
import ProjectsPage from "./pages/ProjectsPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/catalog"} component={Catalog} />
      <Route path={"/catalog/:code"} component={CourseDetail} />
      <Route path={"/curriculum"} component={Curriculum} />
      <Route path={"/library"} component={Library} />
      <Route path={"/labs"} component={Labs} />
      <Route path={"/verify"} component={CertificateVerify} />
      <Route path={"/student"} component={StudentDashboard} />
      <Route path={"/student/tutor"} component={TutorPage} />
      <Route path={"/student/record"} component={AcademicRecord} />
      <Route path={"/student/profile"} component={StudentProfile} />
      <Route path={"/portfolio/:slug"} component={PublicPortfolio} />
      <Route path={"/student/projects"} component={ProjectsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
        defaultTheme="dark"
        // switchable
      >
          <LanguageProvider><TooltipProvider><Toaster /><Router /></TooltipProvider></LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
