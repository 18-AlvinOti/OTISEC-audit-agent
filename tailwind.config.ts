import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        sans: ['Syne', 'sans-serif'],
      },
      colors: {
        teal: {
          50: '#E1F5EE', 100: '#9FE1CB', 200: '#5DCAA5',
          400: '#1D9E75', 600: '#0F6E56', 800: '#085041', 900: '#04342C'
        },
        coral: { 50: '#FAECE7', 200: '#F0997B', 400: '#D85A30', 600: '#993C1D' },
        amber: { 50: '#FAEEDA', 200: '#EF9F27', 400: '#BA7517', 600: '#854F0B' },
        indigo: { 50: '#EEEDFE', 200: '#AFA9EC', 400: '#7F77DD', 600: '#534AB7' },
      }
    },
  },
  plugins: [],
}
export default config
