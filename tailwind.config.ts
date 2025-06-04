/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: true,
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans'],
        serif: ['Roboto Slab', 'serif'],
      },
    },
  },
  plugins: [require('daisyui')],
};