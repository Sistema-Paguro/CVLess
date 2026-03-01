/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        architect: ['"Playfair Display"', 'serif'],
        specialist: ['"JetBrains Mono"', 'monospace'],
        creator: ['"Anton"', 'sans-serif'],
        // Web-safe fonts for the CV A4 area to prevent PDF export bugs
        cv: ['Arial', 'Helvetica', 'sans-serif'],
        'cv-serif': ['Georgia', 'serif'],
      },
      colors: {
        brand: {
          light: '#FFFFFF',
          dark: '#1E293E',
          primary: '#0360ab',
          accent: '#c01c83',
        }
      },
      animation: {
        'liquid': 'liquid 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        liquid: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
