import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pnx: {
          blue: "#36b7ff",
          red: "#ff3158",
          ink: "#05070a",
          steel: "#9aa5b1"
        }
      },
      fontFamily: {
        display: ["var(--font-inter)", "Arial", "sans-serif"],
        body: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 36px rgba(54, 183, 255, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
