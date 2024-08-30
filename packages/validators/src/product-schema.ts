import { z } from 'zod'

// TODO: support

export const productTypeSchema = z.enum([
  'latest',
  'top-rated',
  'summer',
  'winter',
  'women',
  'children',
])

export type ProductTypeSchema = z.infer<typeof productTypeSchema>
