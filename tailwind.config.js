export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C9A84C', dark: '#A98936', light: '#E8C96A' },
        secondary: { DEFAULT: '#1A1A2E', dark: '#0F1117', light: '#32324A' },
        success: '#16855B',
        warning: '#B7791F',
        error: '#C83E4D',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
