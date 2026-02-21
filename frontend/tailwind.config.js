/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#111827',
          card: '#1F2937',
          border: '#374151',
          hover: '#374151',
          text: '#F9FAFB',
          muted: '#9CA3AF',
        },
        brand: {
          blue: '#3B82F6',
          green: '#22C55E',
          red: '#EF4444',
          yellow: '#FBBF24',
          orange: '#F97316',
        },
      },
    },
  },
  plugins: [],
}
