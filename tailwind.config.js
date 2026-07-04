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
        gombapp: {
          bg: '#7c8bb1',
          text: '#102135',
          'card-bg': 'var(--gombapp-card-bg)',
          'card-border': 'var(--gombapp-card-border)',
          'row-border': 'var(--gombapp-row-border)',
          'pill-bg': 'var(--gombapp-pill-bg)',
          'pill-danger-bg': 'var(--gombapp-pill-danger-bg)',
          'btn-disabled': 'var(--gombapp-btn-disabled-bg)',
        },
      },
      fontFamily: {
        brand: 'var(--font-brand)',
        body: 'var(--font-body)',
      },
      keyframes: {
        'gombapp-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'gombapp-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'gombapp-fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'gombapp-slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'gombapp-slide-down': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        'gombapp-slide-up-desktop': {
          from: { transform: 'translateY(50px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'gombapp-slide-down-desktop': {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(50px)', opacity: '0' },
        },
      },
      animation: {
        'gombapp-spin': 'gombapp-spin 1s linear infinite',
        'gombapp-fade-in': 'gombapp-fade-in 0.3s ease-out',
        'gombapp-fade-in-fast': 'gombapp-fade-in 0.2s ease-out',
        'gombapp-fade-out': 'gombapp-fade-out 0.3s ease-out forwards',
        'gombapp-slide-up': 'gombapp-slide-up 0.3s ease-out',
        'gombapp-slide-down': 'gombapp-slide-down 0.3s ease-out forwards',
        'gombapp-slide-up-desktop': 'gombapp-slide-up-desktop 0.3s ease-out',
        'gombapp-slide-down-desktop': 'gombapp-slide-down-desktop 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
