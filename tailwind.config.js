/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        '3xl': '1600px',
        '4xl': '1920px',
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#E07856',
          50: '#FDF6F3',
          100: '#FBECE7',
          200: '#F7D0C3',
          300: '#F2B09A',
          400: '#EC8E70',
          500: '#E07856',
          600: '#C95E3B',
          700: '#A44728',
          800: '#7F331A',
          900: '#5F220E',
        },
        accent: '#E07856',
        secondaryAccent: '#7BA88F',
        success: {
          DEFAULT: '#7BA88F',
          50: '#F5FAF7',
          100: '#EBF4F0',
          500: '#7BA88F',
          600: '#5D8A71',
        },
        warning: {
          DEFAULT: '#E2A96F',
          50: '#FDF8F3',
          100: '#FAF0E2',
          500: '#E2A96F',
          600: '#C2894F',
        },
        error: {
          DEFAULT: '#C96D6D',
          50: '#FDF5F5',
          100: '#FBE8E8',
          500: '#C96D6D',
          600: '#A64D4D',
        },
        brandbg: '#FBF7F2',
        cardbg: '#FFFFFF',
        bordercol: '#EDE6DD',
        primaryText: '#3A342E',
        secondaryText: '#8A8178',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(58, 52, 46, 0.04), 0 0 3px rgba(58, 52, 46, 0.01)',
        'floating': '0 20px 40px -4px rgba(58, 52, 46, 0.06), 0 8px 16px -4px rgba(58, 52, 46, 0.03)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
