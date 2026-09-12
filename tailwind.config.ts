import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F0E17",
          deep: "#08070C",
          panel: "#16141F",
        },
        gold: {
          DEFAULT: "#FFB800",
          bright: "#FFD65C",
          dim: "#8A6300",
        },
        arcane: {
          DEFAULT: "#7B61FF",
          bright: "#9B87FF",
        },
        verdant: {
          DEFAULT: "#00D084",
        },
        strength: {
          DEFAULT: "#FF4D4D",
        },
        intellect: {
          DEFAULT: "#4D9FFF",
        },
        spirit: {
          DEFAULT: "#4DFF88",
        },
        parchment: "#F1EAD8",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 20px rgba(255,184,0,0.35)",
        "gold-lg": "0 0 40px rgba(255,184,0,0.45)",
        arcane: "0 0 20px rgba(123,97,255,0.35)",
        glass: "0 8px 32px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(circle at 50% 0%, rgba(123,97,255,0.12), transparent 60%)",
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "15%": { opacity: "1" },
          "100%": { transform: "translateY(-60px)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        flicker: "flicker 2.4s ease-in-out infinite",
        floatUp: "floatUp 1.2s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
