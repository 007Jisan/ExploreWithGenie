/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006a4e", // Bangladesh Green
        secondary: "#f42a41", // Bangladesh Red
        accent: "#FFD700", // Gold
        dark: "#1f2937",
        light: "#f3f4f6",
      }
    },
  },
  plugins: [],
}