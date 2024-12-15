module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0) translateX(-50%)' },
          '50%': { transform: 'translateY(-10px) translateX(-50%)' }
        }
      },
      animation: {
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
} 