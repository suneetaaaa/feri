/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F8F6F1',
        ink:       '#1A1A1A',
        noir:      '#0F0F0F',
        gold:      '#B8860B',
        'gold-light': '#D4A017',
        'gold-muted': '#8B6914',
        cream:     '#F2EFE8',
        muted:     '#6B6B6B',
        border:    '#E5E0D8',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2' }],
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(26,26,26,0.08), 0 4px 16px rgba(26,26,26,0.04)',
        'card-hover': '0 4px 12px rgba(26,26,26,0.12), 0 12px 32px rgba(26,26,26,0.08)',
        'modal':   '0 20px 60px rgba(15,15,15,0.3)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
      }
    }
  },
  plugins: []
}
