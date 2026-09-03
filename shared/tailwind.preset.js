/** BELENTANI tailwind preset — AGPLv3 · espejo de belentani-theme.css (v1.1 CHROMA) */
module.exports = {
  theme: {
    extend: {
      colors: {
        bel: {
          bg:     '#0b1322',
          paper:  '#f4f7fb',
          ink:    '#0d1626',
          cyan:   '#38e1ff',
          mint:   '#4ef0b0',
          lime:   '#b6ff2e',
          coral:  '#ff6b5e',
          saffron:'#ffb52e',
          violet: '#a78bfa',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { sm: '10px', DEFAULT: '18px', lg: '28px', pill: '99px' },
      backdropBlur: { glass: '18px' },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,.35)',
        lime:  '0 6px 24px rgba(182,255,46,.28)',
      },
      borderColor: { glass: 'rgba(56,225,255,.18)' },
    },
  },
};
