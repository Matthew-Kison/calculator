/** @type {import('tailwindcss').Config} */
import { heroui } from "@heroui/react";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // 'class' 전략 사용
  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "960px",
        xl: "1200px",
      },
    },
  },
  plugins: [heroui()],
};
