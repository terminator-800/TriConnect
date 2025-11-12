/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
         sans: ['Inter', 'sans-serif'], // set Inter as default sans
      }
    },
    screens: {
      'xs': '480px',     // 👈 extra small devices
      'sm': '640px',     // small
      'md': '768px',     // medium
      'lg': '1024px',    // large
      'xl': '1280px',    // extra large
      '2xl': '1536px',   // default 2xl
    },
  },
  plugins: [require('tailwindcss-font-inter')],
}
