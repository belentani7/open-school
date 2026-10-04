import type { Metadata } from "next";
import { Phone, Shield, HeartHandshake, Home, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Emergencias",
  description:
    "Teléfonos y recursos de emergencia accesibles sin conexión para personas migrantes LGTBI+ en Barcelona.",
  robots: { index: true, follow: true },
};

const lines = [
  {
    number: "112",
    label: "Emergencias generales",
    detail: "Sanidad, policía y bomberos. Funciona sin cobertura y sin saldo.",
    icon: Phone,
  },
  {
    number: "024",
    label: "Atención a la conducta suicida",
    detail: "Línea de la Vida. Gratuita, confidencial y 24 horas.",
    icon: HeartHandshake,
  },
  {
    number: "016",
    label: "Violencia machista",
    detail: "Atención 24 horas. No aparece en la factura telefónica.",
    icon: Shield,
  },
  {
    number: "091",
    label: "Policía Nacional",
    detail: "Denuncias, delitos de odio y protección.",
    icon: Shield,
  },
];

const places = [
  {
    name: "Casal Lambda",
    detail: "Asesoría LGTBI+, atención social y acompañamiento.",
    href: "https://www.lambda.cat",
  },
  {
    name: "CEAR Barcelona",
    detail: "Asilo, refugio y asesoría legal para personas migrantes.",
    href: "https://www.cear.es",
  },
  {
    name: "AMIC-UGT",
    detail: "Asesoría jurídica gratuita en extranjería.",
    href: "https://www.ugt.cat",
  },
];

export default function EmergenciaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-28">
      <div className="mb-10">
        <p className="label mb-3 text-neon-cyan">Siempre disponible</p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Emergencias
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Esta página se guarda en tu dispositivo y funciona sin conexión. Si
          estás en peligro inmediato, llama al 112.
        </p>
      </div>

      <section aria-labelledby="lineas" className="mb-14">
        <h2 id="lineas" className="mb-4 font-display text-xl font-semibold text-foreground">
          Teléfonos
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {lines.map((line) => {
            const Icon = line.icon;
            return (
              <li key={line.number} className="glass rounded-2xl p-5">
                <a
                  href={`tel:${line.number}`}
                  className="flex items-center gap-3 text-foreground"
                  aria-label={`Llamar al ${line.number}: ${line.label}`}
                >
                  <Icon className="h-5 w-5 text-neon-cyan" aria-hidden="true" />
                  <span className="font-display text-2xl font-bold">
                    {line.number}
                  </span>
                  <span className="text-sm font-medium">{line.label}</span>
                </a>
                <p className="mt-2 text-sm text-muted-foreground">{line.detail}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="lugares" className="mb-14">
        <h2 id="lugares" className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
          <Home className="h-5 w-5 text-neon-cyan" aria-hidden="true" />
          Dónde acudir
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {places.map((place) => (
            <li key={place.name} className="glass rounded-2xl p-5">
              <a
                href={place.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-neon-cyan"
              >
                {place.name}
              </a>
              <p className="mt-2 text-sm text-muted-foreground">{place.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 text-neon-cyan" aria-hidden="true" />
        Barcelona y L&apos;Hospitalet de Llobregat.
      </p>
    </div>
  );
}
