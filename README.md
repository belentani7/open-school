# open-school

Nodo central del conjunto educativo **Belentani / NOIACORE** (indexado desde
plataformas hermanas como `manos-abiertas`, `secure-t`, `ux-academy`,
`lingua-aberta`, entre otras).

## Estado actual

**Scaffold inicial, sin producto desplegado todavía.** El repositorio contiene
gobernanza y automatización, no código de aplicación:

```
.github/workflows/ci.yml   # pipeline completo: lint, typecheck, test, build,
                           #   Lighthouse, deploy preview (Vercel) y Gitleaks
.gitleaks.toml             # configuración de escaneo de secretos (con allowlist
                           #   legacy de WILLIAMSCHOOL / REDACTED)
CHANGELOG.md               # formato Keep a Changelog; entrada "Unreleased"
CODEOWNERS / CONTRIBUTING.md / CODE_OF_CONDUCT.md / SECURITY.md
package.json               # paquete `open-school` v1.0.0, sin dependencias reales
pnpm-lock.yaml
```

## Advertencias honestas

- **El CI fallará en su estado actual**: `ci.yml` invoca `pnpm run typecheck`,
  `lint`, `check:boundaries`, `test`, `build` y `start`, pero `package.json`
  solo define un script `test` placeholder que termina en error. Hay que añadir
  esos scripts (o recortar el workflow) antes de que el pipeline sea verde.
- **No hay archivo `LICENSE`** aunque `package.json` declara `"license": "ISC"`.
- **No existe todavía** el índice educativo (`INDICE-EDUCATIVO.md`) que otros
  repos del ecosistema han citado; no crear enlaces hacia él hasta que exista.
- No hay código fuente, punto de entrada ni despliegue funcionales por ahora.

## Desarrollo

```bash
corepack enable
pnpm install --frozen-lockfile
```

No hay nada que ejecutar todavía más allá de instalar dependencias.

## Comunidad

Ver [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
y [SECURITY.md](SECURITY.md).
