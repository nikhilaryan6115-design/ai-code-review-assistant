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
        // IVORY & FOREST — Primary palette
        ivf: {
          bg:        '#F5F3ED',   // warm ivory canvas
          bgAlt:     '#E9E7DF',   // secondary bg / sidebar / input fill
          surface:   '#FFFFFF',   // card / popover surface
          pri:       '#24342E',   // dark forest green text
          sec:       '#5C645B',   // muted secondary text
          accent:    '#47745D',   // primary action / active / link
          accentHov: '#3C634F',   // hover state of accent
          accent2:   '#C17B55',   // terracotta highlights
          border:    '#DDDCD3',   // hairline border
          red:       '#B44040',   // critical
          amber:     '#A05C1A',   // warning/pending
          green:     '#2E7253',   // success
        },
        // Legacy editorial.* aliases — mapped to new IVF palette so no code breaks
        editorial: {
          bg:          '#F5F3ED',
          surface:     '#FFFFFF',
          subtle:      '#E9E7DF',
          muted:       '#5C645B',
          border:      '#DDDCD3',
          borderSubtle:'#DDDCD3',
          navy:        '#24342E',
          navyHover:   '#3C634F',
          brass:       '#C17B55',
          brassHover:  '#A0633E',
          brassMuted:  'rgba(193,123,85,0.12)',
          crimson:     '#B44040',
          crimsonMuted:'rgba(180,64,64,0.12)',
          ivy:         '#2E7253',
          ivyMuted:    'rgba(46,114,83,0.12)',
          ochre:       '#A05C1A',
          ochreMuted:  'rgba(160,92,26,0.12)',
          slate:       '#5C645B',
        },
        // Legacy nocturne.* aliases
        nocturne: {
          bg:          '#F5F3ED',
          plum:        '#FFFFFF',
          wine:        '#E9E7DF',
          charcoal:    '#E9E7DF',
          ivory:       '#24342E',
          grey:        '#5C645B',
          border:      '#DDDCD3',
          borderSubtle:'#DDDCD3',
        },
        // Legacy pumpkin → accent
        pumpkin: {
          DEFAULT: '#47745D',
          dark:    '#3C634F',
          light:   '#5A8C71',
        },
        // Legacy wine → accent
        wine: {
          700:     '#47745D',
          800:     '#3C634F',
          900:     '#24342E',
          DEFAULT: '#47745D',
        },
        // Legacy tobacco → sec
        tobacco: {
          400:     '#5C645B',
          500:     '#5C645B',
          DEFAULT: '#5C645B',
        },
        // Legacy buttercream → bg
        buttercream: '#F5F3ED',
      },
      fontFamily: {
        sans:    ['Manrope', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
        // Keep legacy aliases pointing to sans so old class usage doesn't break
        serif:   ['Manrope', 'Inter', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
      },
      boxShadow: {
        'card':           '0 1px 4px rgba(36,52,46,0.08)',
        'card-hover':     '0 3px 8px rgba(36,52,46,0.12)',
        'dropdown':       '0 8px 24px rgba(36,52,46,0.12), 0 0 0 1px #DDDCD3',
        'editorial-card': '0 1px 4px rgba(36,52,46,0.08)',
      }
    },
  },
  plugins: [],
}
