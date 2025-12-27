/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Add this line
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // You can add custom dark colors here if you like
      colors: {
        darkBg: "#0f172a",
        darkCard: "#1e293b",
      },
    },
  },
  plugins: [],
};
