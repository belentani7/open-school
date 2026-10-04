import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

const copy = {
  es: { title: "Se produjo un error inesperado.", body: "La información académica no se ha modificado. Recarga la página para volver a intentarlo.", reload: "Recargar página" },
  pt: { title: "Ocorreu um erro inesperado.", body: "As informações académicas não foram alteradas. Atualiza a página para tentar novamente.", reload: "Recarregar página" },
  en: { title: "An unexpected error occurred.", body: "Academic information has not been changed. Reload the page to try again.", reload: "Reload page" },
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  render() {
    if (!this.state.hasError) return this.props.children;
    const storedLocale = typeof window === "undefined" ? "es" : localStorage.getItem("dict-locale");
    const text = copy[storedLocale === "pt" || storedLocale === "en" ? storedLocale : "es"];
    return <div className="flex items-center justify-center min-h-screen p-8 bg-background"><div className="flex flex-col items-center w-full max-w-2xl p-8"><AlertTriangle size={48} className="text-destructive mb-6 flex-shrink-0"/><h2 className="text-xl mb-3">{text.title}</h2><p className="text-sm text-muted-foreground text-center mb-6">{text.body}</p><button onClick={() => window.location.reload()} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg", "bg-primary text-primary-foreground", "hover:opacity-90 cursor-pointer")}><RotateCcw size={16}/>{text.reload}</button></div></div>;
  }
}

export default ErrorBoundary;
