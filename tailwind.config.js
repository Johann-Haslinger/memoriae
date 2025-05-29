module.exports = {
  darkMode: "media", // or 'class' for manual switching
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      ringColor: {
        focus: "#60a5fa", // blue-400
        "focus-dark": "#60a5fa", // blue-400 (or set to a different color for dark mode if desired)
      },
    },
  },
  plugins: [],
};
