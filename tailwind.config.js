module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          dark: '#007AFF',
        },
        secondary: '#FF9500',
        background: {
          DEFAULT: '#F2F2F7',
          dark: '#000000',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1C1E',
        },
        text: {
          DEFAULT: '#1C1C1E',
          dark: '#FFFFFF',
        },
        'text-secondary': {
          DEFAULT: '#6C6C70',
          dark: '#8E8E93',
        },
        'slate-50': {
          DEFAULT: '#F8FAFC',
          dark: '#1E293B',
        },
        'slate-100': {
          DEFAULT: '#F1F5F9',
          dark: '#334155',
        },
      },
      fontFamily: {
        outfit: ['Outfit-Regular'],
        'outfit-bold': ['Outfit-Bold'],
        'outfit-extrabold': ['Outfit-ExtraBold'],
        'outfit-extralight': ['Outfit-ExtraLight'],
        'outfit-light': ['Outfit-Light'],
        'outfit-medium': ['Outfit-Medium'],
        'outfit-semibold': ['Outfit-SemiBold'],
        'outfit-black': ['Outfit-Black'],
        'outfit-thin': ['Outfit-Thin'],
      },
    },
  },
  plugins: [],
};
