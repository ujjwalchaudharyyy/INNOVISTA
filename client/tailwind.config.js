/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pulse: {
          500: "#6366F1",
          600: "#4F46E5",
          cyan: "#06B6D4",
        }
      }
    },
  },
  plugins: [],
}