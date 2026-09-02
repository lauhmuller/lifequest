/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)'
        },
        gold: 'var(--color-gold)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Nunito"', 'sans-serif']
      },
      borderRadius: {
        quest: '1.25rem'
      }
    }
  },
  plugins: []
}
