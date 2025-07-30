/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      keyframes: {
        pingOnce: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '75%': { transform: 'scale(1.2)', opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'ping-once': 'pingOnce 1s ease-out',
      },
    },
  },
  plugins: [],
};
