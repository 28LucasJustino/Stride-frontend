/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'carbon': '#000000',
        'paper-white': '#ffffff',
        'sky-wash': '#dceeff',
        'concrete-gray': '#cccccc',
        'electric-blue': '#4da2ff',
        'mint-pop': '#55db9c',
        'lavender': '#e9ccff',
        'ember': '#fb4903',
        'sunburst': '#ffd731',
        'voltage-violet': '#5c4ade',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Cabinet Grotesk', 'Plus Jakarta Sans', 'Impact', 'sans-serif'],
      },
      borderRadius: {
        'pill': '1600px',
        'card': '20px',
        'badge': '9999px',
      },
      boxShadow: {
        'sticker': '2px 2px 0px #000000',
        'sticker-lg': '4px 4px 0px #000000',
        'sticker-hover': '5px 5px 0px #000000',
      }
    },
  },
  plugins: [],
}
