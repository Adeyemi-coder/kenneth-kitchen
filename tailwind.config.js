/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-base': '#CF3A0E',       // 4.72:1 AA Pass[cite: 5]
        'primary-pressed': '#A82E0B',    // 6.57:1 AAA Pass[cite: 5]
        'secondary-olive': '#243628',    // 12.32:1 AAA Pass[cite: 5]
        'bg-canvas': '#FAFAFA',          // Main canvas[cite: 5]
        'surface-card': '#FFFFFF',       // Card surface[cite: 5]
        'border-visible': '#CBD1D6',     // Structural borders[cite: 5]
        'ui-control': '#838D94',         // 3.24:1 Sunlight safe controls[cite: 5]
        'ui-control-strong': '#6F7A82',  // 4.21:1 Focused strokes[cite: 5]
        'text-primary': '#111618',       // 15.80:1 AAA Pass[cite: 5]
        'text-secondary': '#4B555D',     // 7.30:1 AAA Pass[cite: 5]
        'status-success': '#0B6A37',     // 6.43:1 AAA Pass[cite: 5]
        'status-pending': '#B54708',     // 5.20:1 AA Pass[cite: 5]
        'status-pending-bg': '#FFF4E5',  // 5.44:1 vs pending text[cite: 5]
        'status-error': '#BA1A1A',       // 6.19:1 AA Pass[cite: 5]
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
};