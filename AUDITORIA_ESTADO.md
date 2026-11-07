# AUDITORIA_ESTADO — open-school

- Cumplimiento: **87.5%** (35 ok / 5 incumple / 9 no evaluable)
- Paginas HTML muestreadas: 400
- Generado: 2026-11-07T15:18:51

## Reglas que incumple

| Regla | Detalle |
|---|---|
| DEV-05 | 1 archivos con console.log |
| DEV-06 | sin archivos duplicados/muertos |
| SEO-01 | lecciones/activities-intents-y-ciclo-de-vida-plataforma-android-platform.html: title 84 chars |
| WEB-07 | lecciones/activities-intents-y-ciclo-de-vida-plataforma-android-platform.html: 2 <h1> |
| WEB-21 | 15 archivos, 1 con sintaxis invalida |

## Reparacion

```bash
python _audit/reparar.py --apply --only open-school
```
