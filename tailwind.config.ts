const { fontFamily } = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary
        primary: {
          50: "#FFE3EC",
          100: "#FFB8D2",
          200: "#FF8CBA",
          300: "#F364A2",
          400: "#E8368F",
          500: "#DA127D",
          600: "#BC0A6F",
          700: "#A30664",
          800: "#870557",
          900: "#620042",
        },

        // Neutrals
        neutral: {
          50: "#F5F7FA",
          100: "#E4E7EB",
          200: "#CBD2D9",
          300: "#9AA5B1",
          400: "#7B8794",
          500: "#616E7C",
          600: "#52606D",
          700: "#3E4C59",
          800: "#323F4B",
          900: "#1F2933",
        },

        // Supporting
        supporting: {
          50: "#F2EBFE",
          100: "#DAC4FF",
          200: "#B990FF",
          300: "#A368FC",
          400: "#9446ED",
          500: "#8719E0",
          600: "#7A0ECC",
          700: "#690CB0",
          800: "#580A94",
          900: "#44056E",
        },
        "gradient-start": "#690CB0",
        "gradient-end": "#F364A2",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
