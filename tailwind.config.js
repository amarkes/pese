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
      fontFamily: {
        inter: ['Inter_18pt-Regular'],
        'inter-bold': ['Inter_18pt-Bold'],
        'inter-extrabold': ['Inter_18pt-ExtraBold'],
        'inter-extralight': ['Inter_18pt-ExtraLight'],
        'inter-light': ['Inter_18pt-Light'],
        'inter-medium': ['Inter_18pt-Medium'],
        'inter-semibold': ['Inter_18pt-SemiBold'],
      },
    },
  },
  plugins: [],
};
