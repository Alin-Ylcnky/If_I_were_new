/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        handwriting: ['"Dancing Script"', 'cursive'],
        mono: ['"Fira Code"', 'monospace'],
        condensed: ['"Roboto Condensed"', 'sans-serif'],
        crimson: ['"Crimson Text"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        baskerville: ['"Libre Baskerville"', 'serif'],
        'dm-sans': ['"DM Sans"', 'sans-serif'],
        allura: ['Allura', 'cursive'],
        raleway: ['Raleway', 'sans-serif'],
        lora: ['Lora', 'serif'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
