# BELENTANI DESIGN SYSTEM — v1.1 CHROMA (AGPLv3)

Fuente verdad: galería oficial CHROMA 2026-09-03 (espectro vivo, glass, LAB contraste).
Archivos canónicos en `shared/`: `belentani-theme.css`, `tailwind.preset.js`, `glass.css`.
Regla: **dark cyber = marca madre**. Modo claro = variante paper para lectura larga.

## Paleta madre v1.1 (dark)
- `--bel-bg: #0b1322` (navy = confianza, 60% superficie)
- `--bel-text: #e8f1ff` · `--bel-muted: #9fb3c8`
- `--bel-cyan: #38e1ff` (tecnología, 30%) · `--bel-mint: #4ef0b0`
- `--bel-lime: #b6ff2e` (acción, 10%, texto encima siempre ink) · `--bel-lime-ink: #0d1626`
- `--bel-coral: #ff6b5e` (alerta) · `--bel-saffron: #ffb52e` (energía) · `--bel-violet: #a78bfa` (IA)
- `--bel-paper: #f4f7fb` (fondo modo claro) · `--bel-ink: #0d1626`
- Glass: `rgba(13,22,38,.55) + blur(18px) saturate(150%) + borde cyan 18% + sombra 0 8px 32px`
- Contrastes verificados WCAG AA en LAB galería (texto ≥4.5:1). Lime solo con tinta ink.

## Tipografía v1.1 (única en los 5)
- Display: `Sora` 400/600/700 — titulares, logos, números grandes.
- Body: `Inter` 400/500/600 — todo texto.
- Mono: `JetBrains Mono` 400/500 — código, labs, hashes, comandos, chips.
- Radius: sm 10px · default 18px · lg 28px · pill 99px.

## Componentes firma
- Badge `100% ONLINE / APRENDE HACIENDO` con icono outline.
- `Ruta de Aprendizaje` con % + timeline (como móvil Secure-T).
- Bottom nav móvil: home, cursos, labs, perfil.
- Footer claim: `APRENDE. PROTEGE. TRANSFORMA.`

## Frontend stack (no tocar)
React 19 + Vite 7 + Tailwind 4 + shadcn/Radix + tRPC + Drizzle + Zustand/Query.
Adaptación = solo tokens + textos, nunca reescribir stack.

## Aplicación por academia
- Secure-T: dark por defecto, lime/cyan, Space Grotesk.
- UX Academy: light paper por defecto, mismos fonts, acento indigo → migrar a ink + lime CTA.
- ManosAbiertas: light, foco contraste AA, mismos fonts.
- Lingua Aberta/Forge: light infantil clara + streak lime, mismos fonts.
- Open-School: host de `shared/belentani-theme.css`.
