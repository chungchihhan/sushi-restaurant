import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#618bab",
        menu: "#aacddd",
        info: "#d5d1d1",
        bar: "#f5f5f5",
      },
    },
    fontFamily: {
      sans: ["var(--noto-sans)", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};
