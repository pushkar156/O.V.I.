import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E", // Deep space blue
        surface: "#111417",
        primary: {
          DEFAULT: "#00E5FF", // Neon Cyan
          glow: "rgba(0, 229, 255, 0.4)",
        },
        secondary: {
          DEFAULT: "#9D50FF", // Pulse Indigo
          glow: "rgba(157, 80, 255, 0.4)",
        },
        accent: "#64FFDA", // Tertiary Mint
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
        "hologram-pulse": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(0, 229, 255, 0.2), 0 0 10px rgba(0, 229, 255, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.6), 0 0 40px rgba(0, 229, 255, 0.3)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
