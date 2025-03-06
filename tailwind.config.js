/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#1a1a1a',
          950: '#111111',
        },
        neon: {
          50: '#edfff7',
          100: '#d5ffed',
          200: '#aeffe0',
          300: '#70ffcc',
          400: '#2bfab0',
          500: '#02e893',
          600: '#00bf78',
          700: '#009562',
          800: '#067552',
          900: '#076145',
          950: '#003726',
        },
      },
    },
  },
  plugins: [],
};