/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        nile: {
          deep: "#0E3B4D",
          blue: "#1F6F8B",
          sand: "#EDE6D6",
          paper: "#F7F3E9",
        },
        clay: "#C1652F",
        ink: "#1C1B18",
        olive: "#5B7B4F",
        muted: "#7A6A55",
        line: "#DED4BE",
      },
      fontFamily: {
        brand: ["Almarai", "sans-serif"],
        body: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
