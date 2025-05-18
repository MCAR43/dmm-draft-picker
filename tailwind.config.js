/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        osrs: {
          yellow: '#FFB83C', // OSRS gold color
          brown: '#5A3825', // Dark brown for chat boxes
          chat: '#0F0F0F', // Black background for chat
          lime: '#00FF00', // Lime green for highlighted text
          blue: '#00FFFF', // Cyan for special items
          red: '#FF0000', // Red for dangerous items/warnings
          orange: '#FF9933', // Orange for warnings
          purple: '#9900FF', // Purple for rare items
          white: '#FFFFFF', // White text
          grey: '#555555', // Grey text
          green: '#00C000', // Green for positive status
          interface: '#382418', // Interface brown
          buttonBg: '#5F4D3A', // Button background
          buttonHover: '#6F5D4A', // Button hover state
          interfaceBorder: '#7A6955', // Interface border
        }
      },
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
  plugins: []
} 