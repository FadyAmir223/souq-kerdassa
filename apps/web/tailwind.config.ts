import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

import baseConfig from '@repo/tailwind-config/web'

export default {
  content: baseConfig.content,
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },

      keyframes: {
        scale: {
          '0%, 100%': { scale: '1' },
          '50%': { scale: '1.2' },
        },
      },

      animation: {
        scale: 'scale 1.5s ease-out infinite',
      },
    },
  },
} satisfies Config
