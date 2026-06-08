import type { Config } from "tailwindcss";

/**
 * Design tokens replicated 1:1 from the Figma frame "UI'Kit" (node 117:5).
 * Most exact values are applied inline via Tailwind arbitrary values to keep
 * the showcase pixel-accurate; these extensions cover the shared vocabulary.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        geist: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        ui: "16px",
        pill: "34px",
        circle: "64px",
      },
      colors: {
        "ui-fg": {
          DEFAULT: "#000000",
          muted: "rgba(0,0,0,0.8)",
          subtle: "rgba(0,0,0,0.65)",
          "on-dark": "#ffffff",
          "on-dark-muted": "rgba(255,255,255,0.8)",
        },
      },
      boxShadow: {
        "ui-drop": "0px 2px 4px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
