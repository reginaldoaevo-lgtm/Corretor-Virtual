/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0a0a0b",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#eab308", // Gold/Yellow
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#121214",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
    },
  },
  plugins: [],
}
