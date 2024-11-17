/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
 
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
    },
    colors: {
      'blue': '#37afe1',
      'light-blue': '#aee0f5',
      'yellow': '#f5f4b3',
      'light-yellow': 'fffecb',
      'black': '#000000',
      'blue-white': '#f2f7fa',
      'white': '#fafafa',
      'light-purple': '#c2a3f0',
      'purple': '#e2c4ff',
      'dark': '#282828',
      'lighter-dark': '#2e2e2e',
      'gray': '#4f4f4f'
    },
    extend: {
      keyframes: {
        fadein: {
          from: {opacity: "0"},
          to: {opacity: "1"}
        }
      },
      animation: {
          fadein: 'fadein 2s ease-in-out',
      }
    },
  },
  plugins: [],
}
export default config