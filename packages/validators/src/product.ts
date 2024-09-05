import { z } from 'zod'

export const productTypeSchema = z.enum(['latest', 'top-rated'])
export type ProductTypeSchema = z.infer<typeof productTypeSchema>

export const productSeasonSchema = z.enum(['summer', 'winter'])
export type ProductSeasonSchema = z.infer<typeof productSeasonSchema>

export const productCategorySchema = z.enum(['women', 'children'])
export type ProductCategorySchema = z.infer<typeof productCategorySchema>

export const productsByFiltersSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  type: productTypeSchema.optional(),
  season: productSeasonSchema.optional(),
  category: productCategorySchema.optional(),
})
