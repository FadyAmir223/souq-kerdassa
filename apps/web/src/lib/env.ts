/* eslint-disable no-restricted-properties */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().trim().min(1).url(),
  },
  server: {
    DATABASE_URL: z.string().trim().min(1).url(),
    ADMIN_USERNAME: z.string().min(1),
    ADMIN_PASSWORD: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
