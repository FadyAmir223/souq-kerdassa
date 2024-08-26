import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
// @ts-expect-error missing .d.ts
import brandColors from 'tailwindcss-brand-colors'
// @ts-expect-error missing .d.ts
import debugScreens from 'tailwindcss-debug-screens'

import base from './base'

export default {
  content: base.content,
  presets: [base],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1240px',
      '2xl': '1496px',
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1240px',
        '2xl': '1496px',
      },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate, debugScreens, brandColors],
} satisfies Config
