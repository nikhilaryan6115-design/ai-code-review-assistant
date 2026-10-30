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
        wine: {
          50: '#FDF7F8',
          100: '#F9ECEE',
          200: '#E8C5CC',
          300: '#D19AA7',
          400: '#9E4A62',
          500: '#7E364C',
          600: '#682D3E',
          700: '#592C3B',
          800: '#451F2C',
          900: '#351C29',
          DEFAULT: '#592C3B',
        },
        tobacco: {
          300: '#CFB597',
          400: '#B2916F',
          500: '#987653',
          DEFAULT: '#987653',
        },
        nocturne: {
          bg: '#0F0C10',        // Deep Charcoal / Near Black base
          plum: '#17131A',      // Card surfaces
          wine: '#221A26',      // Elevated panels & hovers
          charcoal: '#2B222E',  // Inputs / secondary surfaces
          ivory: '#F5F2EB',     // Crisp warm off-white (headings & text)
          grey: '#A1989A',      // Muted grey (high readability metadata)
          border: '#2C222E',    // Restrained, precise borders
          borderSubtle: '#3A2E3D',
        },
        pumpkin: {
          DEFAULT: '#E87927',
          dark: '#C65B12',
          light: '#F59E0B',
        },
        blood: {
          DEFAULT: '#B91C1C',
          dark: '#7F1D1D',
        },
        midnight: {
          DEFAULT: '#0B090C',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(232, 121, 39, 0.15)',
        'dropdown': '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px #2C222E',
      }
    },
  },
  plugins: [],
}
