# Open School: aplicación de documentación oficial

Fecha de aplicación: 2026-10-31. Este registro describe cambios de este repositorio; los demás proyectos mantienen contratos independientes.

## Cursor — contexto de proyecto

`.cursor/rules/open-school-learning.mdc` fija las fuentes curriculares, límites de producto, generación segura, paridad de archivos y criterios accesibles. Las páginas HTML son proyecciones verificables de 12 unidades y 20 lecciones. El número 204 cuenta páginas, no lecciones independientes.

## GitHub — Actions, permisos y artefactos

El workflow `build.yml` anterior solo hacía checkout y se retiró; el build real permanece en CI y en la publicación de Pages. Todos los `uses:` ejecutables restantes de `.github/workflows/` quedan fijados a SHA completo. Cada `checkout` desactiva la persistencia de credenciales, excepto el job de cápsula, que necesita empujar su rama de revisión y recibe permisos limitados de contenido/PR. `ci.yml` conserva lectura; `security.yml` reserva escritura de eventos de seguridad a CodeQL; `tutor-ia.yml` divide escritura de contenido y de issues por job; `pages.yml` da `pages:write` e `id-token:write` únicamente al despliegue.
`client/public/learning-library/` se versiona para publicar al menos 200 páginas con cada checkout. `staticLearningExport.test.ts` vuelve a generar el catálogo y compara por bytes las páginas, CSS, índice y manifiesto. La publicación opcional de GitHub Pages duplica la biblioteca al nivel raíz y corrige el enlace a la app alojada en `/app/`.

## Microsoft Edge — accesibilidad HTML

Las páginas conservan `lang="es"`, un único `h1`, enlace para saltar al contenido, encabezados semánticos, lista de pasos con `aria-current`, foco visible, contraste reforzado, `prefers-reduced-motion`, adaptación móvil y vista de impresión. La prueba de exportación valida cada archivo HTML y cada enlace local; la hoja CSS mantiene las preferencias de movimiento y contraste.

## Revisión de exportaciones Qwen

Las exportaciones de artista, Judas y música no son fuentes educativas ni autorizan reutilizar sus imágenes, audio o código. Se trasladan solo mejoras de proceso aplicables aquí: separar cada producto, marcar qué existe realmente, enlazar fuentes canónicas y ofrecer recorridos accesibles. Los ejemplos didácticos siguen viniendo exclusivamente de las fuentes publicadas de Open School.

## Validación

- `pnpm check`
- `pnpm test` — incluye 204 páginas y paridad byte a byte con la copia versionada
- `pnpm build`
- Recorrido Playwright Chromium desktop y móvil configurado en `.github/workflows/ci.yml`

## Referencias oficiales

- Cursor Project Rules: https://docs.cursor.com/context/rules-for-ai
- GitHub Actions Secure Use: https://docs.github.com/en/actions/reference/security/secure-use
- GitHub Actions dependency lockfiles: https://docs.github.com/en/actions/concepts/security/workflow-dependency-lockfiles
- Microsoft Edge accessibility build guidance: https://learn.microsoft.com/en-us/microsoft-edge/accessibility/build/
- Microsoft Edge reduced motion testing: https://learn.microsoft.com/es-es/microsoft-edge/devtools/accessibility/test-reduced-ui-motion
- Microsoft Edge keyboard testing: https://learn.microsoft.com/en-us/microsoft-edge/devtools/accessibility/test-tab-enter-keys
