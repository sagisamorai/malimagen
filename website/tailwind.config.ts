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
        primary: {
          DEFAULT: "#041E3E",
          50: "#E8EDF2",
          100: "#C5D1DE",
          200: "#8BA3BD",
          300: "#51759C",
          400: "#2A4F76",
          500: "#041E3E",
          600: "#031832",
          700: "#021226",
          800: "#010C1A",
          900: "#01060D",
        },
        gold: {
          DEFAULT: "#9AACBE",
          50: "#F2F5F8",
          100: "#E0E7EE",
          200: "#C1CFDD",
          300: "#B0C0D0",
          400: "#9AACBE",
          500: "#7A92A8",
          600: "#5E7A94",
          700: "#486075",
          800: "#324456",
          900: "#1C2837",
        },
        accent: {
          DEFAULT: "#5B9BD5",
          light: "#A8CBE8",
          dark: "#2E6EA6",
        },
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8F9FB",
          tertiary: "#F0F3F7",
          warm: "#F5F7FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "Assistant", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #7A92A8 0%, #B0C0D0 50%, #7A92A8 100%)",
        "gradient-dark": "linear-gradient(135deg, #041E3E 0%, #0A3260 50%, #041E3E 100%)",
        "gradient-warm": "linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)",
        "gradient-hero": "linear-gradient(135deg, #041E3E 0%, #0A3260 40%, #153E6B 100%)",
        "pattern-dots": "radial-gradient(circle, #9AACBE 1px, transparent 1px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      boxShadow: {
        "premium": "0 4px 20px rgba(4, 30, 62, 0.08), 0 1px 3px rgba(4, 30, 62, 0.04)",
        "premium-lg": "0 10px 40px rgba(4, 30, 62, 0.12), 0 2px 6px rgba(4, 30, 62, 0.06)",
        "gold": "0 4px 20px rgba(91, 155, 213, 0.15)",
        "gold-lg": "0 10px 40px rgba(91, 155, 213, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
