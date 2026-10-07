/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'Cairo', 'sans-serif'],
        display: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      colors: {
        charcoal: {
          50: '#f6f5f4',
          100: '#e9e7e4',
          200: '#d3cfc9',
          300: '#b3aca2',
          400: '#8e8578',
          500: '#736a5e',
          600: '#5e564c',
          700: '#4e483f',
          800: '#423d36',
          900: '#3a3631',
          950: '#211e1b',
        },
        gold: {
          50: '#fdf9ee',
          100: '#faf0d4',
          200: '#f4dfaa',
          300: '#edc876',
          400: '#e7af4c',
          500: '#e09a2e',
          600: '#c87d22',
          700: '#a55e1e',
          800: '#874a1f',
          900: '#713e1d',
          950: '#42200c',
        },
        bronze: {
          50: '#fbf7f3',
          100: '#f5ebe0',
          200: '#e8d4c1',
          300: '#d6b598',
          400: '#c18f6c',
          500: '#b07450',
          600: '#a25e44',
          700: '#874a38',
          800: '#6f3e31',
          900: '#5c352c',
          950: '#341b17',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};
