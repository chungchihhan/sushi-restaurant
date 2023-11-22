import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
<<<<<<< HEAD
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
=======
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
>>>>>>> main
  theme: {
    extend: {
      colors: {
        brand: "#618bab",
        menu: "#aacddd",
        info: "#d5d1d1",
<<<<<<< HEAD
        bar: "#f5f5f5"
=======
        bar: "#f5f5f5",
>>>>>>> main
      },
    },
    fontFamily: {
      sans: ["var(--noto-sans)", ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
<<<<<<< HEAD
}
=======
};
>>>>>>> main
