/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6c5ffc',
        dark: '#1c2434',
        primaryLight: '#c5c1f7',
        secondary: '#6c5ffc',
        secondaryLight: '#6c5ffc',
        danger: '#ef4444',
        success: '#219653',
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        'light-grey': 'rgba(255, 255, 255, 0.2)',
        'primary': '#6c5ffc',
      },
    },
  },
  plugins: [],
};

