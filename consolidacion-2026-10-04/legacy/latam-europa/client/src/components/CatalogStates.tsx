import { AlertTriangle, FileSearch, Loader2 } from "lucide-react";

export function LoadingState() {
  return <div className="catalog-state" role="status"><Loader2 aria-hidden="true" className="animate-spin" size={24} /><p>Actualizando recursos verificados…</p></div>;
}

export function ErrorState() {
  return <div className="catalog-state catalog-state--error" role="alert"><AlertTriangle aria-hidden="true" size={24} /><p>No se ha podido cargar el directorio en este momento. Vuelve a intentarlo en unos instantes.</p></div>;
}

export function EmptyState() {
  return <div className="catalog-state"><FileSearch aria-hidden="true" size={24} /><p>No hemos encontrado resultados con esos filtros. Prueba otro tema o elimina la búsqueda.</p></div>;
}
