import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        signal: "var(--signal)",
        alarm: "var(--alarm)",
        smoke: "var(--smoke)"
      },
      borderWidth: {
        rule: "var(--rule)"
      }
    }
  },
  plugins: []
} satisfies Config;
