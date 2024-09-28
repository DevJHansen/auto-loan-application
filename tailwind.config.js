/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E90FF',
        secondary: '#694e7b',
        accent: '#ffff',
        background: '#4A4A4A',
        success: '#3CB371',
        warning: '#FFC107',
        error: '#E63946',
        disabled: '#4A4A4A',
      },
    },
  },
  plugins: [],
};
