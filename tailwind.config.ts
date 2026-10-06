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
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        hero: {
          sun: "#f59e0b",
          amber: "#d97706",
          coral: "#f43f5e",
          purple: "#8b5cf6",
          sky: "#0284c7",
          mint: "#10b981",
        }
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        mascotBounce: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-18px) scale(1.04)' },
        },
        celebrateDance: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '25%': { transform: 'translateY(-16px) rotate(-8deg) scale(1.08)' },
          '50%': { transform: 'translateY(2px) rotate(0deg) scale(0.98)' },
          '75%': { transform: 'translateY(-16px) rotate(8deg) scale(1.08)' },
        },
        mascotWave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-12deg)' },
          '75%': { transform: 'rotate(14deg)' },
        },
        mascotClap: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        mascotConcerned: {
          '0%, 100%': { transform: 'rotate(-2deg) translateY(0)' },
          '50%': { transform: 'rotate(2deg) translateY(-4px)' },
        },
        tearDrip: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.6)' },
          '40%': { opacity: '1', transform: 'translateY(12px) scale(1)' },
          '80%': { opacity: '0.8', transform: 'translateY(28px) scale(0.9)' },
          '100%': { opacity: '0', transform: 'translateY(36px) scale(0.3)' },
        },
        floatPill: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        }
      },
      animation: {
        'mascot-idle': 'bounceSubtle 3s ease-in-out infinite',
        'mascot-dance': 'celebrateDance 0.75s ease-in-out infinite',
        'mascot-bounce': 'mascotBounce 0.6s ease-in-out infinite',
        'mascot-wave': 'mascotWave 0.8s ease-in-out infinite',
        'mascot-clap': 'mascotClap 0.4s ease-in-out infinite',
        'mascot-concerned': 'mascotConcerned 3s ease-in-out infinite',
        'tear-drip': 'tearDrip 1.8s ease-in-out infinite',
        'float-pill': 'floatPill 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
