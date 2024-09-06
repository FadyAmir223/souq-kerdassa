import { z } from 'zod'

export const productByQuerySchema = z.object({
  query: z.string().trim().min(1),
  limit: z.number(),
  cursor: z.string().optional(),
})
export type ProductByQuerySchema = z.infer<typeof productByQuerySchema>
