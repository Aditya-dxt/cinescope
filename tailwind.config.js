/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#08080c",
        surface: "#12121a",
        "surface-2": "#1a1a24",
        border: "#23232f",
        muted: "#9a9ab0",
        accent: "#e50914",
        "accent-2": "#ff3b30",
      },
      borderRadius: {
        xl: "16px",
      },
      maxWidth: {
        "screen-xl": "1200px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial"],
      }
    },
  },
  plugins: [],
}
