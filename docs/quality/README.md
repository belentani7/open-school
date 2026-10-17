# Evidencia local del contrato educativo

La fuente canónica es [el contrato de 200 reglas](../CONTRATO_EDUCATIVO_200_REGLAS.md). Este directorio no copia el contrato: conserva únicamente el estado y la evidencia de **Open School**.

- `evidence.json` contiene exactamente E001–E200.
- `NO MEDIDO` significa que aún no existe una comprobación reproducible; no significa incumplimiento.
- `VERIFICADO` exige al menos una ruta, URL de prueba, informe o PR en `evidence`.
- `N/A JUSTIFICADO` exige el campo `justification`.
- El validador no concede estados: comprueba la estructura, los conteos y la presencia de referencias. No verifica que una referencia exista ni que demuestre la regla; esa revisión corresponde al PR.

Comprobación:

```bash
node scripts/verify-education-contract.mjs
node --test scripts/verify-education-contract.test.mjs
```

Cada avance debe modificar solo las reglas demostradas y enlazar su evidencia.

## Reconciliación verificada — 17 de octubre de 2026

La rama del contrato (PR #28, base `eab4896`) se verificó combinada con `main`
(`d7935ed`). Durante esa comprobación, el contrato y su baseline se incorporaron
a `main` mediante el PR #31 (`b43c58b`). Se conserva esa fuente canónica y su
workflow sin cambios; el delta del PR #28 registra esta evidencia, aclara el
alcance del validador y excluye archivos generados de Python y Vercel.

Verificación ejecutada con Node 22.23.3, pnpm 10.4.1 y Python 3.12.14:

- `pnpm install --frozen-lockfile`: correcto.
- `pnpm check`: correcto; `pnpm test`: 98 pruebas en 9 archivos.
- `pnpm build`: correcto; `pnpm audit --audit-level=high`: sin vulnerabilidades conocidas.
- `python -m pytest -q` desde `backend/`: 30 pruebas correctas.
- `python -m ruff check app tests ../api`: correcto.
- Las 5 pruebas del validador pasan y el ledger tiene exactamente 200 reglas.

Esto verifica la integración técnica de la rama. No acredita la totalidad del
producto ni una publicación: el ledger sigue indicando **0/200 VERIFICADO**
y requiere evidencia específica para asignar cada regla.

