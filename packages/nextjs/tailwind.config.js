/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Amethyst Color Palette
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8FAFC',
        'bg-tertiary': '#F1F5F9',
        'border-primary': '#E2E8F0',
        'border-secondary': '#CBD5E1',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#64748B',
        'orange-primary': '#8A72C7',
        'orange-secondary': '#A488D4',
        'orange-light': '#F5F3FF',
        'orange-dark': '#7A63B0',
        'purple-primary': '#8A72C7',
        'purple-secondary': '#A488D4',
        'purple-light': '#F5F3FF',
        'purple-dark': '#7A63B0',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      backdropBlur: {
        'glass': '12px',
      },
      boxShadow: {
        'modern': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'modern-lg': '0 8px 40px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(138, 114, 199, 0.3)',
        'glow-lg': '0 0 30px rgba(138, 114, 199, 0.4)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
} 