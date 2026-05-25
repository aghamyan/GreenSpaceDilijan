/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f3f7ef",
          100: "#e3edd9",
          300: "#9fbd83",
          500: "#5d7f42",
          700: "#39552b",
          900: "#20311d",
        },
        clay: "#a46c43",
        moss: "#6f7f42",
        cream: "#f8f2e7",
        ink: "#182018",
      },
      fontFamily: {
        sans: ["Inter", "Arian AMU", "Noto Sans Armenian", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(24, 32, 24, 0.12)",
      },
    },
  },
  plugins: [],
};
