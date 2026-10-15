# Evidencia local del contrato educativo

La fuente canónica es [el contrato de 200 reglas](../CONTRATO_EDUCATIVO_200_REGLAS.md). Este directorio no copia el contrato: conserva únicamente el estado y la evidencia de **Open School**.

- `evidence.json` contiene exactamente E001–E200.
- `NO MEDIDO` significa que aún no existe una comprobación reproducible; no significa incumplimiento.
- `VERIFICADO` exige al menos una ruta, URL de prueba, informe o PR en `evidence`.
- `N/A JUSTIFICADO` exige el campo `justification`.
- El validador no concede estados: impide conteos incompletos o afirmaciones sin prueba.

Comprobación:

```bash
node scripts/verify-education-contract.mjs
node --test scripts/verify-education-contract.test.mjs
```

Cada avance debe modificar solo las reglas demostradas y enlazar su evidencia.

