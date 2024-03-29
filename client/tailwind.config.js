/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/**/*.{html,js}"],
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['"Raleway"', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        'npurple': '#D3c4be',
        'npink': '#ebcfc4',
        'nlime': '#e8e8d9',
        lime: colors.lime,
        slate: colors.slate,
        emerald: colors.emerald,
        'softteal': '#91E1BE',
        teal: colors.teal,
        pink: colors.pink,
        'softpurple': '#D191E1',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '.125rem',
        DEFAULT: '.25rem',
        'lg': '.5rem',
        'full': '9999px',
      }
    }
  }
}

