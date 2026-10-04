import { Scale } from "lucide-react";

export function LegalNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={compact ? "legal-notice legal-notice--compact" : "legal-notice"}
      aria-label="Aviso de alcance jurídico"
    >
      <Scale aria-hidden="true" className="shrink-0" size={compact ? 16 : 19} />
      <p>
        <strong>Información orientativa.</strong> LATAM Europa no sustituye el asesoramiento jurídico ni la confirmación del organismo competente.
      </p>
    </aside>
  );
}
