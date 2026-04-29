/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: "#070a12",
          800: "#0b101b",
          700: "#111827",
          600: "#1a2235",
        },
        tide: {
          300: "#6fffc8",
          400: "#2ee6a6",
          500: "#1bbd86",
          600: "#12956a",
        },
        ember: {
          300: "#ffb37a",
          400: "#ff8f3f",
          500: "#ff7a2d",
          600: "#e06520",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 8px 40px rgba(46, 230, 166, 0.18)",
        "glow-lg": "0 20px 60px rgba(46, 230, 166, 0.28)",
        "glow-ember": "0 8px 40px rgba(255, 143, 63, 0.18)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(46,230,166,0.2)" },
          "50%": { boxShadow: "0 0 28px rgba(46,230,166,0.45)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(46,230,166,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(46,230,166,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      opacity: {
        "3": "0.03",
        "8": "0.08",
        "12": "0.12",
        "15": "0.15",
        "35": "0.35",
      },
    },
  },
  plugins: [],
};
