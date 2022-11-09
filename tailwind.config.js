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
        whitem1: '#ffffff85',
        white0: '#ffffff33',
        wheat: '#F4F3EC',
        wheat2: '#c3c2bd',
        brightGreen0: '#51FFC0',
        brightGreen: '#01FFA4',
        brightGreen1: '#00FF66',
        brightGreen2: '#02B61F',
        floral: '#ff87ec',
        cyan0: '#87afbc',
        cyan: '#0affb2',
        forest: '#1F5B25',
        navym2: '#5d86ff',
        navym1: '#aabffc',
        navy0: '#2454e0',
        navy: '#0F2D4E',
        navy1: '#122868',
        navy2: '#122568',
        orange0: '#ffd2c3',
        orange: "#FF6C34",
        finish0: '#2b9a58',
        finish: '#1DBE5D',
        finish2: '#1ED868',
        finish3: '#36CF73',
        tan: '#D1D0C8',
        teal: '#1DBE5D',
        rest1: '#d85cb1',
        rest2: '#15398f',
        restBg: '#302c65',
        pink: '#ffcfff',
        active1: '#202e91',
        active2: '#020405'
      }
    },
  },
  plugins: [],
}
