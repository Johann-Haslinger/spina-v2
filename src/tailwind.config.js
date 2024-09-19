module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],

  darkMode: 'selector',

  theme: {
    fontFamily: {},
    extend: {
      colors: {
        'primary-color': '#325FFF',
        primary: '#000000',
        'primary-text': '#1E1E1E',
        'primary-text-dark': '#ffffff',
        'secondary-text': '#86858A',
        'secondary-text-dark': '#86858A',
        'placeholder-text': '#BDBDBD',
        'placeholder-text-dark': '#595959',
      },
      backgroundColor: {
        primary: '#F5F5F5',
        secondary: '#F6F6F6',
        tertiary: 'rgb(234,234,234)',
        'primary-dark': '#000000',
        'secondary-dark': '#1A1A1A',
        'tertiary-dark': '#232323',
      },
      borderColor: {
        'primary-border': '#E1E1E5',
        'primary-border-dark': '#444444',
      },
    },
  },
  plugins: [],
};
