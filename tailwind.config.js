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
        // Classic, Refined Editorial Design Palette
        editorial: {
          bg: '#0E1116',           // Deep charcoal canvas
          surface: '#161B22',      // Primary card surface
          subtle: '#1D232C',       // Secondary elevation / active row
          muted: '#252D38',        // Inputs / headers
          border: '#2E3643',       // Hairline structural border
          borderSubtle: '#222934',
          navy: '#1A2332',         // Oxford Navy accent
          navyHover: '#233045',
          brass: '#C5A059',        // Antique Muted Brass
          brassHover: '#D4AF67',
          brassMuted: 'rgba(197, 160, 89, 0.12)',
          crimson: '#A63232',      // Muted Crimson for critical risks
          crimsonMuted: 'rgba(166, 50, 50, 0.14)',
          ivy: '#2D6A4F',          // English Ivy for approved checks
          ivyMuted: 'rgba(45, 106, 79, 0.14)',
          ochre: '#B7791F',        // Warm Ochre for warnings
          ochreMuted: 'rgba(183, 121, 31, 0.14)',
        },
        // Mapped tokens ensuring compatibility and seamless visual harmony
        nocturne: {
          bg: '#0E1116',
          plum: '#161B22',
          wine: '#1D232C',
          charcoal: '#252D38',
          ivory: '#F2F4F8',
          grey: '#96A0B0',
          border: '#2E3643',
          borderSubtle: '#222934',
        },
        pumpkin: {
          DEFAULT: '#C5A059',      // Muted antique brass
          dark: '#B08C45',
          light: '#D4AF67',
        },
        wine: {
          700: '#1A2332',          // Oxford Navy
          800: '#141C29',
          900: '#0F1622',
          DEFAULT: '#1A2332',
        },
        tobacco: {
          400: '#96A0B0',
          500: '#838D9E',
          DEFAULT: '#96A0B0',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Lora', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        heading: ['Newsreader', 'Lora', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '3px',
        md: '6px',
        lg: '8px',
        xl: '10px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 3px 8px rgba(0, 0, 0, 0.45)',
        'dropdown': '0 8px 24px rgba(0, 0, 0, 0.55), 0 0 0 1px #2E3643',
      }
    },
  },
  plugins: [],
}
