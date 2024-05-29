module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  darkMode: "selector",

  theme: {
    fontFamily: {},
    extend: {
      colors: {
        primaryColor: "#325FFF",
        primary: "#000000",
        primatyText: "#1E1E1E",
        primaryTextDark: "#ffffff",
        seconderyText: "#86858A",
        seconderyTextDark: "#86858A",
        placeholderText: "#BDBDBD",
        placeholderTextDark: "#595959",
      },
      backgroundColor: {
        primary: "#F5F5F5",
        secondery: "#F6F6F6",
        tertiary: "rgb(234,234,234)",

        primaryDark: "#000000",
        seconderyDark: "#1a1a1a",
        tertiaryDark: "#232323",
      },
      borderColor: {
        primaryBorder: "#E1E1E5",
        primaryBorderDark: "#444444",
      },
    },
  },
  plugins: [],
};
