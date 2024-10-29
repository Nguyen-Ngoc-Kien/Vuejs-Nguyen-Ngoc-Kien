module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-sm': {'max': '640px'}, // Custom max-width for mobile
      },
    },
  },
  plugins: [],
}