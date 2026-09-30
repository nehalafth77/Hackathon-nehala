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
        vault: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#b4c6fc',
          400: '#8da2fb',
          500: '#637bf7',
          600: '#4355ec',
          700: '#3440d4',
          800: '#2c35aa',
          900: '#1e2478',
        },
        navy: {
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#0b1120',
          975: '#070c18',
        },
        accent: {
          blue: '#2563eb',
          softBlue: '#3b82f6',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'vault-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        'vault': '0 4px 14px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'vault-md': '0 10px 25px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
        'vault-lg': '0 20px 35px -8px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.05)',
        'focus-ring': '0 0 0 3px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}


