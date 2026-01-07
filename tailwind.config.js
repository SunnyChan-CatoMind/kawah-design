/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kwah-navy': '#002147',
        'kwah-gold': '#b59a5d',
        'kwah-light-gold': '#d4c29d',
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

