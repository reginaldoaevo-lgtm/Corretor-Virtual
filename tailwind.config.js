/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        primary: {
          DEFAULT: "#D4AF37",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#050505",
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
}
