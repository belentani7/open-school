import { writeFileSync } from "node:fs";

const categories = [
  ["ARC", "Arquitectura y modularidad"],
  ["TYP", "Tipado y calidad TypeScript"],
  ["SEC", "Seguridad y cifrado"],
  ["PRI", "Privacidad y GDPR"],
  ["BKG", "Procesos en segundo plano y sincronización"],
  ["LRN", "Motor de aprendizaje y contenido"],
  ["PER", "Rendimiento y memoria"],
  ["A11", "Accesibilidad y UX/UI"],
  ["TST", "Pruebas y QA"],
  ["DOC", "Documentación, mantenimiento y despliegue"],
];

const overrides = new Map([
  ["TYP-0001", ["VERIFICADO", "pnpm exec tsc --noEmit --pretty false terminó con código 0", "audit-final-validation.txt"]],
  ["TST-0001", ["VERIFICADO", "28 tests pasan; 1 test omitido", "audit-regression-validation.txt"]],
  ["DOC-0001", ["VERIFICADO", "pnpm build terminó con código 0 en la validación final", "audit-final-validation.txt"]],
  ["BKG-0001", ["NO_CONFORME", "El servicio usa una cola persistente y tarea Expo; el backend real no está configurado", "audit_observations.md"]],
  ["BKG-0002", ["NO_CONFORME", "La sincronización no elimina elementos sin handler configurado", "tests/audit-regressions.test.ts"]],
  ["BKG-0003", ["CORREGIDO", "Se unificó la clave user_profile y se añadió prueba de regresión", "lib/services/sync.ts"]],
  ["LRN-0001", ["CORREGIDO", "Se añadió validación de respuesta y feedback en el reproductor", "app/lesson/[id].tsx"]],
  ["PRI-0001", ["CORREGIDO", "Se conectaron consentimiento, exportación compartible y borrado local", "app/(tabs)/settings.tsx"]],
  ["SEC-0001", ["CORREGIDO", "El perfil usa el adaptador SecureStore nativo con fallback web documentado", "lib/contexts/user-context.tsx"]],
  ["A11-0001", ["CORREGIDO", "Se añadieron labels, hints y roles en controles principales", "app/lesson/[id].tsx"]],
  ["PER-0001", ["NO_VERIFICADO", "No se ejecutó perfilado en dispositivos físicos ni prueba de batería", "audit_observations.md"]],
  ["SEC-0002", ["NO_VERIFICADO", "La auditoría de dependencias expiró con código 124", "audit-raw.txt"]],
]);

const lines = ["control_id,category_code,category,status,evidence,source"];
for (const [code, name] of categories) {
  for (let i = 1; i <= 1000; i += 1) {
    const id = `${code}-${String(i).padStart(4, "0")}`;
    const [status, evidence, source] = overrides.get(id) ?? [
      "NO_VERIFICADO",
      "No existe evidencia individual suficiente en esta ejecución",
      "audit_matrix_spec.md",
    ];
    lines.push([id, code, name, status, evidence, source].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
  }
}

writeFileSync("audit-matrix-10000.csv", `${lines.join("\n")}\n`);
console.log(`Generated ${lines.length - 1} audit controls`);
