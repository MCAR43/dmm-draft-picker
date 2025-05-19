/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'osrs': ['RuneScape', 'monospace']
      },
      backgroundImage: {
        'osrs-border': "url('/images/ui/osrs-border.png')",
        'osrs-button': "url('/images/ui/osrs-button.png')",
        'osrs-button-hover': "url('/images/ui/osrs-button-hover.png')",
        'osrs-background': "url('/images/ui/osrs-bg.png')",
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
} 