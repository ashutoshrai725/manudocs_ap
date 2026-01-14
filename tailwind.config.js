/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'manu-green': '#32AC5D',
        'manu-dark': '#000000ff',
        'manu-light': '#ffffffff',
        'manu-custom': '#a4a4a4ff',
        'manu-iitm': '#D6A64F',
        'manu-bits': '#ffffffff',
        'manu-rkic': '#9C5843',

      }
    },
  },
  plugins: [],
}


