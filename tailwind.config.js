/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
       screens: {
        xs: "475px",   // 👈 extra-small screens (custom)
        sm: "640px",   // small
        md: "768px",   // medium
        lg: "1024px",  // large
        xl: "1280px",  // extra-large
        "2xl": "1536px", // double extra-large
      },
      colors: {
        darkBlue: "#0B0C2A",
        deepPurple: "#1A1C4E",
        accentPurple: "#6C63FF",
        accentPurpleHover: "#7F6FFF",
        textGray: "#B0B3C7",
        success: "#00C853",
        danger: "#FF3B30"
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(to right, #0B0C2A, #1A1C4E)", // for page bg
        "gradient-btn": "linear-gradient(to right, #6C63FF, #8E2DE2)" // for button bg
      }
    },
  },
  plugins: [],
}

