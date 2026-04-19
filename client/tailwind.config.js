/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080f",
          900: "#0c0e18",
          800: "#12152a",
          700: "#1a1f3a",
        },
        accent: {
          DEFAULT: "#ff6b35",
          dim: "#ff8f66",
        },
        neon: "#7cf5ff",
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 107, 53, 0.25)",
      },
    },
  },
  plugins: [],
};
