/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
      }
    },
  },
  plugins: [],
}