/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
      },
      animation: {
        'fade-in': 'fade-in 1s both',
        'fade-in-up': 'fade-in-up 1s both',
        'bounce-in': 'bounce-in 0.8s both',
        'slideDown': 'slideDown 0.3s ease-out forwards',
        'slideUp': 'slideUp 0.3s ease-out forwards',
        'slideInDown': 'slideInDown 0.3s ease-out forwards',
        'slideOutUp': 'slideOutUp 0.3s ease-out forwards',
      },
      keyframes: {
        'slideDown': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideUp': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        'slideInDown': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideOutUp': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        'xl': '20px',
      },
      boxShadow: {
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-primary',
    'text-primary',
    'hover:bg-primary/10',
    'hover:text-secondary',
    'bg-primary/10',
    'bg-white/90',
    'bg-white/95',
    'bg-gray-50/80',
    'bg-gray-100/80',
    'animate-slideDown',
    'animate-slideUp',
    'animate-slideInDown',
    'animate-slideOutUp',
  ],
}; 