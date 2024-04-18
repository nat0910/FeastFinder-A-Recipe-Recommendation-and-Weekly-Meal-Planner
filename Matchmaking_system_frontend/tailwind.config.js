/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      width: {
        "recipe-card": "240px",
      },
      height: {
        "recipe-card": "200px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
