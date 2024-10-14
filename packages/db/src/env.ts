/* eslint-disable no-restricted-properties */

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).optional(),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
})

export const env = envSchema.parse(process.env)
