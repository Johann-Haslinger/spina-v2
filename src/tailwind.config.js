

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],


  darkMode: 'selector',
 
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        primary: "#000000",
        primatyText: "#1E1E1E",
        primaryTextDark: "#ffffff",
        seconderyText: "#86858A",
        seconderyTextDark: "#86858A",
        placeholderText: "#BDBDBD",
       
      },
      backgroundColor: {
        primary: "#F5F5F5",
        primaryDark: "#000000",
        secondery: "#F6F6F6"
      
      },
      borderColor: {
        primaryBorder: '#E1E1E5',
      },
    },
  },
  plugins: [],
};
