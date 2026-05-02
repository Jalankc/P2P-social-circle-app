/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sp-canopy':   '#0f291e',
        'sp-deep':     '#1b4332',
        'sp-moss':     '#2d6a4f',
        'sp-fern':     '#40916c',
        'sp-sapling':  '#52b788',
        'sp-mint':     '#74c69d',
        'sp-parchment':'#95d5b2',
        'sp-amber':    '#d4a017',
        'sp-cream':    '#f5f0e1',
        'sp-honey':    '#f4d03f',
        'sp-bark':     '#3e2723',
        'crypt-purple':'#7c3aed',
        'crypt-glow':  '#a78bfa',
        'crypt-terminal':'#00ff41',
        'crypt-ember': '#ff6b35',
        'crypt-void':  '#1a0b2e',
      },
      fontFamily: {
        vt323:   ['VT323', 'monospace'],
        grotesk: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm:      '0px',
        md:      '0px',
        lg:      '0px',
        xl:      '0px',
        '2xl':   '0px',
        full:    '2px', // avatars only
      },
    },
  },
  plugins: [],
}
