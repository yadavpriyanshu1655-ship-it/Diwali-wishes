/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        text: 'var(--color-text)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'border-subtle': 'var(--color-border-subtle)',
      },
      fontFamily: {
        serif: ['"Rozha One"', '"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(73, 56, 46, 0.06), 0 2px 6px -1px rgba(73, 56, 46, 0.04)',
        'earthy': '0 10px 30px -4px rgba(185, 101, 67, 0.12), 0 4px 12px -2px rgba(73, 56, 46, 0.06)',
      },
    },
  },
  plugins: [],
}
