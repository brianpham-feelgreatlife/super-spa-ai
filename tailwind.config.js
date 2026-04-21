/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The Digital Sanctuary - Design System Tokens
        "spa-linen": "#fbf9f4",
        "spa-linen-dim": "#dadad2",
        "spa-sage": "#4b6559",
        "spa-sage-dim": "#3f584d",
        "spa-sage-container": "#cce9da",
        "spa-blush": "#735959",
        "spa-blush-container": "#fddada",
        "spa-lavender": "#645b75",
        "spa-lavender-container": "#eaddfd",
        "spa-surface": "#fbf9f4",
        "spa-surface-low": "#f5f4ed",
        "spa-surface-container": "#efeee7",
        "spa-surface-high": "#e9e8e1",
        "spa-surface-highest": "#e3e3db",
        "spa-surface-lowest": "#ffffff",
        "spa-on-surface": "#31332e",
        "spa-on-surface-variant": "#5e6059",
        "spa-outline": "#7a7b75",
        "spa-outline-variant": "#b2b2ab",
        "spa-error": "#a83836",
      },
      fontFamily: {
        serif: ["Noto Serif", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "spa-ambient": "0px 20px 40px rgba(49, 51, 46, 0.05)",
        "spa-float": "0px 8px 30px rgba(49, 51, 46, 0.08)",
      },
      backdropBlur: {
        "spa": "20px",
        "spa-heavy": "40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "thinking": "thinking 1.4s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        thinking: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "1" },
          "30%": { transform: "translateY(-6px)", opacity: "0.7" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
