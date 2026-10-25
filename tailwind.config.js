/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Graphite table and floor.
        table: {
          DEFAULT: "#151619",
          deep: "#111215",
          night: "#0D0E10",
        },
        // Hairlines and text.
        line: "#EDEDED",
        // The one accent: brand blue (also the ball).
        ball: {
          DEFAULT: "#2563EB",
          // Lighter tint for text on the dark background (AA contrast).
          text: "#6E9BF7",
        },
        rubber: "#2563EB",
        ink: "#09090A",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
