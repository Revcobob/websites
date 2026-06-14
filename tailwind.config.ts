import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink:  { DEFAULT: '#1F2421', soft: '#3B433E', mute: '#6C736E' },
        sand: { DEFAULT: '#F7F2EA', deep: '#EFE6D7', card: '#FBF8F2' },
        teal: { DEFAULT: '#0F4C4A', deep: '#0A3A39', soft: '#1A6A66', pale: '#D8E6E4' },
        clay: { DEFAULT: '#B8553A', deep: '#8E3F2A', pale: '#F2D7CC' },
        gold: { DEFAULT: '#D4A04F', deep: '#A5772E', pale: '#F4E4C1' },
        sage: { DEFAULT: '#6F9C7A', deep: '#4F7559', pale: '#DCE9DE' }
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,76,74,0.06), 0 8px 24px rgba(15,76,74,0.06)',
        lift: '0 4px 8px rgba(15,76,74,0.06), 0 16px 40px rgba(15,76,74,0.08)'
      }
    }
  },
  plugins: []
};

export default config;
