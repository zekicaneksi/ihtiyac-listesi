import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#543310",
        foreground: "#74512D",
        element: "#AF8F6F",
        highligt: "#E1DCC2",
      },
    },
  },
  plugins: [],
};
export default config;
