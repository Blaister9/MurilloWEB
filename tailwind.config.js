/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#FAFAF5',
        amarillo: '#F5A623',
        verde: '#2D7A3E',
        textoPrincipal: '#1A1A0F',
        textoSecundario: '#5C5C4A',
        azulCTA: '#1A56DB',
        verdeClaro: '#E8F5EA',
        amarilloClaro: '#FEF3C7',
        fondoCard: '#FFFFFF',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        impact: ['"Bebas Neue"', 'Arial Narrow', 'sans-serif'],
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '400%': '400%',
      },
    },
  },
  safelist: [
    'animate-fade-up',
    'animate-fade-in',
  ],
  plugins: [],
}
