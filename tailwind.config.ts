import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 18px 40px rgba(31, 56, 53, 0.16)',
        control: '0 10px 24px rgba(33, 64, 60, 0.14)',
      },
      fontFamily: {
        display: ['Trebuchet MS', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
