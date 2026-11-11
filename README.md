# open-school

Sitio estatico (HTML) — 5639 paginas HTML.

## Estructura

- `assets/`
- `backend/`
- `campus/`
- `lecciones/`
- `legacy/`
- `locales/`
- `modulos/`
- `rutas/`
- `universal-docs/`
- `universal-lecciones/`
- `universal-modulos/`
- `universal-rutas/`

## Uso local

```bash
start index.html            # abre la portada en el navegador
python -m http.server 8080  # servidor local si hay rutas absolutas
```

## Verificacion

```bash
python tools/verify_site.py --root .   # enlaces relativos rotos y assets ausentes
```

## Notas

README generado por `_audit/aplicar_auditoria.py` a partir del inventario real
del repositorio. Editar libremente: el generador no sobrescribe archivos.
