/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      "signika-negative": ["var(--font-signika-negative)"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          light: "#eff6ff",
        },
        dark: "#111111",
        "card-color": "#1a1a1c",
        "line-color": "#323335",
        gray: "#9294a0",
        "charcoal-gray": "#36384f",
        white: "#ffffff",
        black: "#000000",
        hover: "#f1f5f9",
        transparent: "transparent",
        green: "#22C55E",
        blue: "#38BDF8",
        wine: "#e11d48",
        yellow: "#FACC15",
      },
    },
  },
  plugins: [],
};
