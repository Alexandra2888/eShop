/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      colors: {
        emerald: {
          350: "#4ade8a",
          450: "#22d46e",
        },
        zinc: {
          950: "#09090b",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(16, 185, 129, 0.6)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(16, 185, 129, 0.2)",
        glow: "0 0 30px rgba(16, 185, 129, 0.3)",
        "glow-lg": "0 0 60px rgba(16, 185, 129, 0.4)",
        card: "0 4px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.15)",
        "card-dark": "0 4px 20px rgba(0,0,0,0.4)",
        "card-dark-hover": "0 20px 60px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
