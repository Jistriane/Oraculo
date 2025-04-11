/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F3F4F6',
        primary: '#1E40AF',
        secondary: '#6B7280'
      }
    },
  },
  plugins: [],
} 