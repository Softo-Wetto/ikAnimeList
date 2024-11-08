// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',   // Dark blue
        accent: '#d97706',    // Orange
        background: '#f3f4f6' // Light gray for background
      },
    },
  },
  plugins: [],
};
