/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.js",
    "./src/pages/**.js",
    "./src/components/**.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7A00',
        secondary: '#0B3CEA',
        footerb: '#1A2A66',
        cusGray: '#555453',
        ashGray: '#DADADA'
      },
      fontFamily: {
        'roboto': ['Roboto', 'sand-serif'],
        'poppins': ['Poppins', 'sand-serif'],
        'ruthie': ['Ruthie', 'sand-serif'],
      }
    },
  },
  plugins: [],
}

