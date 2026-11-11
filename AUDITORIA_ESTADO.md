# AUDITORIA_ESTADO — open-school

- Cumplimiento: **97.5%** (39 ok / 1 incumple / 9 no evaluable)
- Paginas HTML muestreadas: 400
- Generado: 2026-11-07T18:29:43

## Reglas que incumple

| Regla | Detalle |
|---|---|
| DEV-06 | sin archivos duplicados/muertos |

## Reparacion

```bash
python _audit/reparar.py --apply --only open-school
```
