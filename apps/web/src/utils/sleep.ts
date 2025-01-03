import { env } from '@/lib/env'

export async function sleep(ms?: number) {
  if (env.NODE_ENV !== 'development') return
  await new Promise((r) => setTimeout(r, ms ?? 2000))
}
