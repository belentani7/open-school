# AGENTS.md — open-school

> Sitio estatico HTML/CSS/JS (sin build) del ecosistema Belentani7.

## Contexto del proyecto

Sitio estatico HTML/CSS/JS (sin build)

## Reglas de desarrollo

### Protocolo spec-first

Toda modificacion sigue: PRD -> SRS -> Design Doc -> ADR -> Plan -> Tests GWT.

### Impeccable (diseno frontend)

Pre-ship checklist:

- Contraste de texto >= 4.5:1
- Sin gradient text ni bordes tipo side-stripe
- Sin rejillas de tarjetas identicas ni tarjetas anidadas
- z-index semantico
- Touch targets >= 44px
- Estados vacio, error y carga disenados

## Estructura del repositorio

```
assets/
backend/
campus/
lecciones/
locales/
modulos/
rutas/
universal-docs/
universal-lecciones/
universal-modulos/
universal-rutas/
.gitignore
.nojekyll
accesibilidad.html
```

## Comandos

```bash
no requiere instalacion
python tools/verify_site.py --root .
```

## Seguridad

- No commitear secretos. Ejecutar `gitleaks detect` antes de cada push.
- CODEOWNERS: @belentani7.
- Protocolo completo: `SECURITY_AUDIT_PROTOCOL.md` (R1-R8).

## Enlaces del ecosistema

- Catalogo de reglas: `_meta/reglas-oficiales.md` (GH/WEB/ACC/SEO/COH/DEV)
- Estado del ecosistema: `REPOSITORIOS_ESTADO_AUDITORIA.md`

*Generado por `_audit/reparar.py` — plantilla §10 de REPOSITORIOS_ESTADO_AUDITORIA.md.*
