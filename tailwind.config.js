/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C5A059', // Premium Gold
        'primary-dark': '#B8860B', // Dark Goldenrod
        'primary-light': '#E5C17C', // Soft Gold
        secondary: '#FDFBF7', // Rich Cream
        dark: '#121212', // Softer Black
        'gray-light': '#F9F9F9',
        gold: {
          100: '#F9F1D8',
          200: '#E5C17C',
          300: '#D4AF37',
          400: '#C5A059',
          500: '#B8860B',
          600: '#8B6508',
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
