/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#b40019',
        'primary-dark': '#8b0013',
        'primary-light': '#e6001f',
        secondary: '#f7f7f7',
        dark: '#1a1a1a',
        'gray-light': '#f7f7f7',
        holiday: {
          red: '#6D071A', // Deep Burgundy
          green: '#1A3C34', // Deep Forest Green
          gold: '#D4AF37', // Champagne Gold
          cream: '#FDFBF7', // Rich Cream
        },
      },
      fontFamily: {
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        slideUp: 'slideUp 1s ease-out forwards',
        fadeIn: 'fadeIn 1s ease-out forwards',
      }
    },
  },
  plugins: [],
}
