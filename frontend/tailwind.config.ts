import type { Config } from "tailwindcss";
const { colors: defaultColors } = require('tailwindcss/defaultTheme');

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        ...defaultColors,
        "primary-gray": "#101010",
        "primary-color": "#4B48E2", // purple
        white: {
          100: "rgb(255, 255, 255, 1)", // 100% opacity
          80: "rgb(255, 255, 255, 0.8)", // 80% opacity
          60: "rgb(255, 255, 255, 0.6)", // 60% opacity
          40: "rgb(255, 255, 255, 0.4)", // 40% opacity
          20: "rgb(255, 255, 255, 0.2)", // 20% opacity
          10: "rgb(255, 255, 255, 0.1)", // 10% opacity
          5: "rgb(255, 255, 255, 0.04)"  // 4% opacity
        },
      },
    },
  },
  plugins: [],
};

export default config;
