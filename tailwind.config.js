/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#FF9500',
        background: '#F2F2F7',
        card: '#FFFFFF',
        text: '#1C1C1E',
        'text-secondary': '#6C6C70',
      },
    },
  },
  plugins: [],
};
