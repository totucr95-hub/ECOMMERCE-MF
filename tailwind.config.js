/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './shell/src/**/*.{html,ts,scss}',
    './landing/src/**/*.{html,ts,scss}',
    './shop/src/**/*.{html,ts,scss}',
    './admin/src/**/*.{html,ts,scss}',
    './auth/src/**/*.{html,ts,scss}',
    './shared-ui/src/**/*.{html,ts,scss}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f766e',
          soft: '#ccfbf1',
          dark: '#115e59',
        },
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.06)',
      },
      spacing: {
        18: '4.5rem',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
