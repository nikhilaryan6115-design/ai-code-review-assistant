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
        // Core Design Identity
        wine: {
          50: '#FBF5F7',
          100: '#F5E9ED',
          200: '#E8C8D4',
          300: '#D69FB3',
          400: '#A9506D',
          500: '#8C3E57',
          600: '#723246',
          700: '#592C3B', // Primary Brand Window Wine
          800: '#46212D',
          900: '#321620',
          DEFAULT: '#592C3B',
        },
        tobacco: {
          50: '#FAF7F3',
          100: '#F3EDE4',
          200: '#E5D8C7',
          300: '#D2BDA4',
          400: '#B69779',
          500: '#987653', // Secondary Accent Dried Tobacco
          600: '#826343',
          700: '#694F34',
          800: '#523C26',
          900: '#3B2B1B',
          DEFAULT: '#987653',
        },
        buttercream: {
          50: '#FEFCF7',
          100: '#FBF6EC',
          200: '#F5E8C9', // Foundation Buttercream
          300: '#EDD9A4',
          400: '#E2C77E',
          500: '#D3B156',
          DEFAULT: '#F5E8C9',
        },
        warm: {
          white: '#FFFDF7',
          bg: '#F9F5EC',
          subtle: '#F4ECE0',
          charcoal: '#30272A',
          muted: '#81766F',
          dim: '#A39992',
          border: '#E8DCB8',
          borderSubtle: '#EFE5CE',
          borderStrong: '#D6C4A2',
          card: '#FFFDF7',
          cardHover: '#FCF9F1',
        },
        // Semantic statuses
        status: {
          critical: '#991B1B',
          criticalBg: '#FEF2F2',
          criticalBorder: '#FECACA',
          warning: '#B45309',
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
          success: '#2D6A4F',
          successBg: '#F0FDF4',
          successBorder: '#BBF7D0',
          info: '#987653',
          infoBg: '#FAF7F3',
          infoBorder: '#E5D8C7',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px rgba(48, 39, 42, 0.04)',
        'warm-md': '0 2px 6px -1px rgba(48, 39, 42, 0.06), 0 1px 3px rgba(48, 39, 42, 0.03)',
        'warm-lg': '0 8px 20px -3px rgba(48, 39, 42, 0.08), 0 3px 6px -2px rgba(48, 39, 42, 0.04)',
        'warm-dropdown': '0 12px 30px -4px rgba(48, 39, 42, 0.12), 0 4px 8px -2px rgba(48, 39, 42, 0.04)',
        'wine-sm': '0 2px 4px rgba(89, 44, 59, 0.12)',
      }
    },
  },
  plugins: [],
}
