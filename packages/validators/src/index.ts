import { z } from 'zod'

export * from './product-schema'

export const inputSchema = z.object({ task: z.string() })

export const cuidSchema = z.string().cuid()
