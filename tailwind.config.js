/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        expandNav: {
          '0%': { width: '5rem' },
          '100%': { width: '55%' },
        },
        moveLogo: {
          '0%': { left: '50%', transform: 'translateX(-50%)' },
          '100%': { left: '0.5rem', transform: 'translateX(0)' },
        },
        showCenter: {
          '0%': { opacity: '0' },
          '60%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        showButtons: {
          '0%': { opacity: '0' },
          '60%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '60%': { opacity: '0.6', transform: 'translateY(13px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '50%': {
            opacity: '0.6',
            transform: 'scale(1.05)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'zoom-fade-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(1.5)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(10%)', opacity: '0' },
          '100%': { transform: 'translateX()', opacity: '1' },
        },
      },
      animation: {
        expandNav: 'expandNav 0.8s ease-out forwards',
        moveLogo: 'moveLogo 0.6s ease-out forwards 0.2s',
        showCenter: 'showCenter 0.45s cubic-bezier(.22,.9,.3,1) forwards 0.6s',
        showButtons: 'showButtons 0.4s ease-out forwards 0.6s',
        fadeIn: 'fadeIn 0.45s cubic-bezier(.22,.9,.3,1) forwards 0.6s',
        fadeInUp: 'fadeInUp 0.9s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.45s cubic-bezier(.92,.9,.9,1) forwards',
        'pulse-fade-in': 'pulse-fade-in 0.5s ease-out forwards',
        'zoom-fade-in': 'zoom-fade-in 1s ease-out forwards',
        'slide-in-left': 'slide-in-left 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
