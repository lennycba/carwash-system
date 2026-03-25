/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cw: {
          darkBlue: "#1E3A5F",
          skyBlue: "#3B82F6",
          gray: "#F3F4F6",
          white: "#FFFFFF",
        },
      },
      boxShadow: {
        card: "0 20px 45px rgba(30, 58, 95, 0.12)",
      },
    },
  },
  plugins: [],
};
