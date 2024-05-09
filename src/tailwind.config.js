

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],


  darkMode: 'selector',
 
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        primaryColor:"#325FFF",
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
        primaryDark: "#000000",
        secondery: "#F6F6F6",
        seconderyDark: "#141414",
        tertiary: "rgb(234,234,234)",
        tertiaryDark: "#1a1a1a",
      
      },
      borderColor: {
        primaryBorder: '#E1E1E5',
        primaryBorderDark: '#444444',
      },
    },
  },
  plugins: [],
};
