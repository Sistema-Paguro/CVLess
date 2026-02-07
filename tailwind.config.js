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
      },
      // Branding colors can be added here
      colors: {
        // Example placeholders
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
