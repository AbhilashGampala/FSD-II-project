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
        brand: {
          orange: '#E58A1F',
          green: '#94BC36',
          purple: '#95058A',
          violet: '#95058A'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          primary: '#FFFFFF',
          secondary: '#F7F8FA',
          muted: '#F3F4F6',
          border: '#E5E7EB'
        },
        content: {
          primary: '#252525',
          secondary: '#666666',
          muted: '#8E8E93'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'popover': '0 10px 25px -5px rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
}
