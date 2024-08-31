import { productSeasonSchema } from '@repo/validators'
import { z } from 'zod'

export const sampleProductsSchema = z.object({
  type: z.enum([...productSeasonSchema.options, 'latest']),
  limit: z.number(),
})
export type SampleProductsSchema = z.infer<typeof sampleProductsSchema>

export const productByQuerySchema = z.object({
  query: z.string().trim().min(1),
  limit: z.number(),
  cursor: z.string().optional(),
})
export type ProductByQuerySchema = z.infer<typeof productByQuerySchema>
