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
        dark: {
          bg: '#0A0D14',
          subtle: '#0F1420',
          card: '#141A29',
          cardHover: '#1A2236',
          border: '#232D42',
          borderLight: '#2F3C57',
          text: '#F1F5F9',
          muted: '#94A3B8',
          dim: '#64748B'
        },
        brand: {
          blue: '#3B82F6',
          blueHover: '#2563EB',
          purple: '#8B5CF6',
          purpleLight: '#A78BFA',
          cyan: '#06B6D4'
        },
        status: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          low: '#3B82F6',
          success: '#10B981',
          passed: '#10B981'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.25)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.25)',
        'glow-critical': '0 0 20px -3px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
