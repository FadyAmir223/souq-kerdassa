import { z } from 'zod'

const schema = z.object({
  EXPO_PUBLIC_SITE_URL:
    process.env.NODE_ENV === 'production'
      ? z.string().trim().min(1).url()
      : z.string().trim().min(1).url().optional(),
})

export const env = schema.parse(process.env)
