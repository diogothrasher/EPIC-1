/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#090A0C',
          card: '#111317',
          border: '#252A33',
          hover: '#1A1F28',
          text: '#F3F5F7',
          muted: '#9AA3AF',
        },
        brand: {
          blue: '#A5AFBC',
          green: '#7FB59A',
          red: '#C86E6E',
          yellow: '#C5B079',
          orange: '#B8926A',
          terminal: '#00FF41',
          terminalDim: '#00C032',
        },
      },
    },
  },
  plugins: [],
}
