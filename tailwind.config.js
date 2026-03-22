/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Prevent Tailwind from conflicting with existing custom CSS
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'menu-bg': 'var(--color-menu-bg)',
        'menu-text': 'var(--color-menu-text)',
        'menu-hover': 'var(--color-menu-hover)',
        accent: 'var(--color-accent)',
        'musor-bg': 'var(--color-musor-bg)',
        'jegyek-bg': 'var(--color-jegyek-bg)',
        'helyszin-bg': 'var(--color-helyszin-bg)',
        'story-bg': 'var(--color-story-bg)',
        'keptar-bg': 'var(--color-keptar-bg)',
        'kapcsolat-bg': 'var(--color-kapcsolat-bg)',
      },
      fontFamily: {
        brand: 'var(--font-brand)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [],
}
