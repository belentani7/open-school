import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Tutor = lazy(() => import("@/pages/Tutor"));
const VoicePractice = lazy(() => import("@/pages/VoicePractice"));
const VoiceLanding = lazy(() => import("@/pages/VoiceLanding"));
const Catalog = lazy(() => import("@/pages/Catalog"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Employment = lazy(() => import("@/pages/Employment"));
const EvidenceRecord = lazy(() => import("@/pages/EvidenceRecord"));
const Labs = lazy(() => import("@/pages/Labs"));
const Lesson = lazy(() => import("@/pages/Lesson"));
const Library = lazy(() => import("@/pages/Library"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const OpenInstitution = lazy(() => import("@/pages/OpenInstitution"));
const Programs = lazy(() => import("@/pages/Programs"));
const Projects = lazy(() => import("@/pages/Projects"));

function Router() {
  return <Suspense fallback={<div className="loading-page">Abriendo experiencia de aprendizaje…</div>}><Switch>
    <Route path="/" component={Home} />
    <Route path="/programas" component={Programs} />
    <Route path="/proyectos" component={Projects} />
    <Route path="/idiomas" component={Catalog} />
    <Route path="/diagnostico" component={Onboarding} />
    <Route path="/biblioteca" component={Library} />
    <Route path="/labs" component={Labs} />
    <Route path="/empleo" component={Employment} />
    <Route path="/abierto" component={OpenInstitution} />
    <Route path="/mi-espacio" component={Dashboard} />
    <Route path="/mi-constancia" component={EvidenceRecord} />
    <Route path="/tutor" component={Tutor} />
    <Route path="/practica-oral" component={VoiceLanding} />
    <Route path="/practica-oral/:id" component={VoicePractice} />
    <Route path="/lecciones/:id" component={Lesson} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></Suspense>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
