import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Warm, literary color palette
        cream: "#FFFBF0",
        parchment: "#F5ECD7",
        leather: "#8B4513",
        ink: "#1A1A2E",
        sage: "#6B8F71",
        "sage-light": "#A8C5AE",
        forest: "#2D5F2D",
        gold: "#C4A35A",
        "gold-light": "#E8D5A3",
        rust: "#B7472A",
        "warm-gray": "#6B6B6B",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", '"Times New Roman"', "serif"],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "paper-texture":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c5a9' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
