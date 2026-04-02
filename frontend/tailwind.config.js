export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#D4AF37', // Luxurious gold
          600: '#AA8C2C', // Darker gold for hovers
        },
        dark: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
