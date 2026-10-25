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
        // Text on dark and blue.
        line: "#EDEDED",
        ink: "#09090A",
        // Editorial direction: brand blue field, paper white sections.
        brand: {
          DEFAULT: "#2563EB",
          light: "#3B7BF7",
          deep: "#1B47C4",
        },
        paper: "#F3F5F9",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
