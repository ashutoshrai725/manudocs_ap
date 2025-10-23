/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'manu-green': '#21b13cff',
        'manu-dark': '#000000ff',
        'manu-light': '#ffffffff',
        'manu-custom': '#a4a4a4ff',
        'manu-iitm': '#D6A64F',
        'manu-bits': '#DFECF4',
        'manu-rkic': '#9C5843',

      }
    },
  },
  plugins: [],
}


