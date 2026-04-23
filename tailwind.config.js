/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC", // Off-white / Cool Gray
        surface: "#FFFFFF", // Pure white for crisp question cards
        primary: "#00D4C8", // Bright Coral/Red-Orange
        accent: "#FFD60A", // Vibrant Yellow (Great for streaks/stars!)
        success: "#4ADE80", // Fresh Green
        danger: "#FF6B6B", // Soft Red
        textMain: "#1E2937", // Dark Slate
        textMuted: "#64748B", // Muted Gray
      },
    },
  },
  plugins: [],
};
