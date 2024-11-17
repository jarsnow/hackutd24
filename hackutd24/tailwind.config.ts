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
      'light-blue': '#4cc9fe',
      'yellow': '#f5f4b3',
      'light-yellow': 'fffecb',
      'black': '#000000',
      'blue-white': '#f2f7fa',
      'white': '#fafafa'
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