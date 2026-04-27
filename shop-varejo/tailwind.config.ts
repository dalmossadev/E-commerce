import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/constants/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Design Tokens — Identidade Visual Neon ──────────────────
      colors: {
        brand: {
          primary:    '#00FF00',   // Verde Neon — CTA, destaques, foco
          background: '#000000',   // Preto Puro — fundo global
          surface:    '#1A1A1A',   // Cinza Escuro — cards, seções
          'surface-2':'#242424',   // Hover / elevação de cards
          text:       '#FFFFFF',   // Branco — leitura
          muted:      '#A3A3A3',   // Texto secundário
          border:     '#2A2A2A',   // Bordas sutis
          'neon-dim': '#00CC00',   // Verde neon hover (escurecido)
        },
      },

      // ── Tipografia ────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)', 'monospace'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },

      // ── Animações ─────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px #00FF00, 0 0 16px #00FF0033' },
          '50%':       { boxShadow: '0 0 20px #00FF00, 0 0 40px #00FF0055' },
        },
        'scan': {
          '0%':   { top: '-2%' },
          '100%': { top: '102%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.3' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.5s ease both',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'scan':       'scan 4s linear infinite',
        'blink':      'blink 1.2s ease-in-out infinite',
      },

      // ── Box Shadow neon ───────────────────────────────────────────
      boxShadow: {
        neon:    '0 0 12px #00FF00, 0 0 24px #00FF0033',
        'neon-sm':'0 0 6px  #00FF00, 0 0 12px #00FF0022',
        'neon-lg':'0 0 24px #00FF00, 0 0 48px #00FF0044',
      },
    },
  },
  plugins: [],
};

export default config;
