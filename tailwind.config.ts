import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#152A4E",
        paper: "#F7F8FA",
        surface: "#FFFFFF",
        line: "#E1E5EB",
        text: "#1B2433",
        muted: "#5A6574",
        accent: "#2A56C6",
        emergency: "#C62828",
      },
      borderRadius: {
        button: "6px",
        input: "6px",
        card: "8px",
        modal: "8px",
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        none: "none",
        modal: "0 8px 24px rgba(21, 42, 78, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
