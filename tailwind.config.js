/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      animation: {
        'float': 'float 3.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'wiggle': 'wiggle 1.2s ease-in-out infinite',
        'spin-slow': 'spin 4s linear infinite',
        'spin-fast': 'spin 0.35s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(250, 204, 21, 0.7)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 24px 8px rgba(250, 204, 21, 0.35)', transform: 'scale(1.04)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
      },
    },
  },
  plugins: [],
};
