/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wheat: '#F4F3EC',
        wheat2: '#c3c2bd',
        brightGreen0: '#51FFC0',
        brightGreen: '#01FFA4',
        brightGreen1: '#00FF66',
        brightGreen2: '#02B61F',
        forest: '#1F5B25',
        navy: '#0F2D4E',
        orange: "#FF6C34",
        finish: '#1DBE5D',
        finish2: '#1ED868',
        finish3: '#36CF73',
        tan: '#D1D0C8',
        teal: '#1DBE5D',
      }
    },
  },
  plugins: [],
}
