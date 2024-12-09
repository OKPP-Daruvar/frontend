/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Urbanist", "sans-serif"],
    },
    extend: {
      colors: {
        blue: "#6f79f7",
        green: "#b7f1dc",
        yellow: "#f6e899",
        red: "#f88989",
        "light-gray": "#f6f5fa",
        "medium-gray": "#e6e5ec",
        "dark-gray": "#5e677d",
        black: "#131217",
      },
    },
  },
  plugins: [],
};
