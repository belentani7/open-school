# Consolidacion open-school - consolidacion-2026-10-04

- Fuente local: `C:\Users\USER\Documents\09_ARCHIVO\GITHUB_CONSOLIDACION\_stage_v2\open-school`
- Repositorio: `belentani7/open-school`
- Rama: `consolidacion/2026-10-04`
- Ficheros transferidos: **11373** (87314740 bytes)
- Ficheros inspeccionados en origen: **11838**
- Ficheros excluidos: **465**
- Generado: 2026-10-04 22:18

## Motivos de exclusion

- extension-no-permitida: 255
- extension-denegada: 182
- nombre-denegado: 18
- vacio: 9
- denegado-explicito: 1

## Ficheros excluidos de forma explicita (material sensible)

- `legacy/belentani-school-unificado/firebase-applet-config.json`

## Control de secretos

Escaneado con clasificador determinista (fichero, linea, regla, veredicto).
Los hallazgos marcados REAL en codigo son credenciales de ejemplo de tests y
docker-compose (`live-token`, `duckpass123`, `top-secret`, `DEMO_KEY`, `pass`).
Las coincidencias de `AKIA...`, `AIza...`, `sk-`, `ghp_` y `xox...` que aparecen
en el arbol estan dentro de payloads base64 de imagenes embebidas o son
definiciones de escaneres en ficheros `ci.yml` y `verify-spec.ps1`.
