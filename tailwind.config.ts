import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'color-old-rose': '#C08081',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: true,
  },
};

export default config;
