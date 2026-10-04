import type { SourceStatus as Status } from "@shared/latam-data";
import { AlertTriangle, Check, Clock3 } from "lucide-react";

const meta: Record<Status, { label: string; className: string; icon: typeof Check }> = {
  verified: { label: "Verificada", className: "status--verified", icon: Check },
  review: { label: "Revisión necesaria", className: "status--review", icon: Clock3 },
  unavailable: { label: "No disponible", className: "status--unavailable", icon: AlertTriangle },
};

export function SourceStatus({ status }: { status: Status }) {
  const { label, className, icon: Icon } = meta[status];
  return <span className={`source-status ${className}`}><Icon aria-hidden="true" size={13} />{label}</span>;
}
