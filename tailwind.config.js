/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for an elite look
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#000000", // Pure black background
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#D4AF37", // Main Metallic Gold
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#1C1C1C", // Secondary Onyx Black
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#111111", // Light Dark Gray
          foreground: "#A0A0A0",
        },
        accent: {
          DEFAULT: "#FFD700", // Bright Gold for Highlights
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#0A0A0A",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#050505", // Near Pure Black for the Cards
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Inter font for a modern look
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
}
