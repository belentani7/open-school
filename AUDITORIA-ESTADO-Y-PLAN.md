# Auditoría, situación y plan de elevación — `open-school`

Generado 2026-11-03 por el pase de reglas del ecosistema (catálogo `_meta/reglas-oficiales.md`).
Todo lo afirmado aquí sale de datos reales: base de consolidación, gate oficial y git.

- **Categoría:** educacion · **Ruta:** `C:\Users\USER\belentani-ecosystem\educacion\open-school`
- **Remoto:** https://github.com/belentani7/open-school.git · **Rama:** main · **HEAD:** b628547 (docs(auditoria): gobernanza GH-01..10 verificada (GH-09/GH-10 OK) + estado y pla)
- **Lenguajes:** .md:71,.ts:34,.py:26,.json:25,.tsx:21,.html:20 · **Commits (git real):** 254 · **Tamaño worktree:** 17.8 MB
- **Visibilidad GitHub:** public · **Homepage:** https://open-school.vercel.app · **HTTP:** HTTP_404
- **GitHub Pages:** no activo

## 1. Situación actual

- **Consolidación:** familia `proyecto-openschool` · acción survivor (estable).
- **Git:** 3 ficheros sin commitear · 7 commits sin push · 5 commits del pase de reglas (desde 2026-11-02).
- **Reglas web (gate oficial):** 1661 HTML · **0 hallazgos** · 0 títulos duplicados.
- **Gobernanza GitHub (protocolo MS):** 11/11 reglas aplicadas · completo.
- **Secretos (triaje):** sin hallazgos.

## 2. Comandos para arreglar y elevar (ejecutar en este orden)

1. **Reglas web: ya cumplidas (0 hallazgos).** Barrera continua:
   ```powershell
   python C:\Users\USER\belentani-ecosystem\_meta\check_web_rules.py open-school
   ```
2. **Enlace público roto (HTTP HTTP_404):** redesplegar o actualizar el homepage. Sin `VERCEL_TOKEN` local no se puede desplegar desde aquí:
   ```powershell
   gh api -X PATCH repos/belentani7/open-school -f homepage=""    # mientras no haya deployment vivo
   # con token: vercel --prod  (o activar GitHub Pages si el repo es público)
   ```
3. **Publicar en GitHub Pages** (repo público; la cuenta free solo publica repos públicos):
   ```powershell
   gh api -X POST repos/belentani7/open-school/pages -f source[branch]=main -f source[path]=/
   gh api -X POST repos/belentani7/open-school/pages/builds/latest -X POST 2>$null   # o dejar que el workflow publique
   ```
4. **Limpiar 3 ficheros sin commitear** (revisar antes; si son del pase de reglas, commitear):
   ```powershell
   git -C "C:\Users\USER\belentani-ecosystem\educacion\open-school" status --short
   git -C "C:\Users\USER\belentani-ecosystem\educacion\open-school" add -- <solo los ficheros del pase> ; git -C "C:\Users\USER\belentani-ecosystem\educacion\open-school" commit -m "fix(web-rules): ..."
   ```
5. **Subir al remoto** (requiere tu confirmación explícita; hoy ningún repo tiene push):
   ```powershell
   git -C "C:\Users\USER\belentani-ecosystem\educacion\open-school" push origin main
   ```

## 3. Qué puede alcanzar este repositorio

- **Repositorio público**: puede publicar gratis en GitHub Pages (`https://belentani7.github.io/open-school/`) y mantener Vercel; hoy tiene Pages desactivado
- Con 1661 páginas HTML y el catálogo de reglas cumplido, es candidato a **superviviente/documentado** del ecosistema: README con arranque real, índice navegable y CI que ejecute `check_web_rules.py`.

---
*Evidencia: `_meta/consolidacion/consolidacion.db` · `_meta/specs/2026-11-01-*` · gate `check_web_rules.py` · git log. Regenerable con `python _meta/gen_auditoria_repos.py`.*
