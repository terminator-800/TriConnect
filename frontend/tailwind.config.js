/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'xs': '480px',     // 👈 extra small devices
      'sm': '640px',     // small
      'md': '768px',     // medium
      'lg': '1024px',    // large
      'xl': '1280px',    // extra large
      'xl1440': '1440px', // 👈 your custom breakpoint
      '2xl': '1536px',   // default 2xl
    },
  },
  plugins: [],
}
