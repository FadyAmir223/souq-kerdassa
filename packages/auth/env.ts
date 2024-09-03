/* eslint-disable no-restricted-properties */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']).optional(),
    AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().min(1).optional(),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION || process.env.npm_lifecycle_event === 'lint',
  emptyStringAsUndefined: true,
})
