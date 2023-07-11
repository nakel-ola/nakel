/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#003326",
        white: "#ffffff",
        black: "#000000",
        dark: "#000212",
        line: "#313649",
        burnham: {
          50: "#ebfef5",
          100: "#cffce4",
          200: "#a3f7cf",
          300: "#68edb6",
          400: "#2cdb98",
          500: "#08c181",
          600: "#009d69",
          700: "#007e57",
          800: "#026346",
          900: "#03513c",
          950: "#003326",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 30% at 50% 0%,rgba(0,51,38,1),transparent)",
        "hero-gradient-big":
          "radial-gradient(ellipse 100% 100% at 50% 0%,#03513c,transparent)",
        "hero-gradient-2":
          "radial-gradient(circle, rgba(0,51,38,1) 0%, rgba(0,2,18,1) 100%)",
        "box-gradient":
          "linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.10) 100%)",
        "component-gradient":
          "radial-gradient(ellipse 100% 40% at 50% 60%,rgba(0,51,38,1),transparent)",
      },
    },
  },
  plugins: [],
};
