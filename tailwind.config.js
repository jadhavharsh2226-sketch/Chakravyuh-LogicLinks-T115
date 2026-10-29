/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bench: {
          bg: "#0E1012",
          surface: "#16191C",
          elevated: "#1D2125",
          highlight: "#22272B",
          border: "#282E33",
          borderSubtle: "#1F2428",
          text: "#ECEBE4",
          textMuted: "#9CA3A8",
          textDim: "#646F77",
          accent: "#C6FF3D", // Lime volt
          signalHigh: "#3DDCFF", // Electric cyan
          signalLow: "#525C64", // Muted graphite
          danger: "#FF4D4D", // Red
          warning: "#FFB020", // Amber
          success: "#C6FF3D",
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(198, 255, 61, 0.25)',
        'glow-cyan': '0 0 20px rgba(61, 220, 255, 0.25)',
        'glow-danger': '0 0 20px rgba(255, 77, 77, 0.25)',
        'instrument': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px #282E33',
      },
      borderRadius: {
        'bench': '6px',
        'instrument': '8px',
      },
      keyframes: {
        pulseSignal: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        dash: {
          to: { strokeDashoffset: '-20' }
        }
      },
      animation: {
        'pulse-signal': 'pulseSignal 1.5s ease-in-out infinite',
        'signal-flow': 'dash 1s linear infinite',
      }
    },
  },
  plugins: [],
}
