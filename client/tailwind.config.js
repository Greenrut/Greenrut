/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '560px', // Custom breakpoint for extra small screens
        'sm': '720px', // Custom breakpoint for small screens
        'md': '900px', // Custom breakpoint for medium screens
        'lg': '1100px', // Custom breakpoint for large screens
      },
    },
  },
  plugins: [],
}