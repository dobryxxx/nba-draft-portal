/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fundo e superfícies
        base:    '#edeae4',
        surface: '#f2efe9',
        panel:   '#f7f5f1',
        border:  '#d8d4ce',
        // Acentos pastéis
        violet:  '#7c6fbf',
        blush:   '#d4877a',
        sage:    '#7aad8a',
        amber:   '#c4973a',
        teal:    '#4a9b9b',
        rose:    '#c47a8a',
        // Texto
        ink:     '#2c2a27',
        mid:     '#7a7570',
        muted:   '#a09891',
        lo:      '#c5bfb5',
      },
      fontFamily: {
        mono:    ['"Space Mono"', 'monospace'],
        sans:    ['"DM Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        numeric: ['"Sora"', '"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        'neu': '16px',
        'neu-sm': '12px',
        'neu-xs': '8px',
        'pill': '999px',
      },
      boxShadow: {
        'neu':        '6px 6px 14px #d4d0ca, -6px -6px 14px #ffffff',
        'neu-sm':     '3px 3px 8px #d4d0ca, -3px -3px 8px #ffffff',
        'neu-inset':  'inset 4px 4px 10px #d4d0ca, inset -4px -4px 10px #ffffff',
        'neu-inset-sm':'inset 2px 2px 6px #d4d0ca, inset -2px -2px 6px #ffffff',
      },
      animation: {
        'bar-fill':  'barFill 1.4s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-up':  'slideUp 0.35s ease forwards',
      },
      keyframes: {
        barFill:  { to: { width: 'var(--target-width)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
