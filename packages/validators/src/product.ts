import { z } from 'zod'

export const productTypeSchema = z.enum(['latest', 'top-rated'])
export type ProductTypeSchema = z.infer<typeof productTypeSchema>

export const productSeasonSchema = z.enum(['summer', 'winter'])
export type ProductSeasonSchema = z.infer<typeof productSeasonSchema>

export const productCategorySchema = z.enum(['women', 'children'])
export type ProductCategorySchema = z.infer<typeof productCategorySchema>

const productsPaginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
})

export const productsByFiltersSchema = productsPaginationSchema.extend({
  type: productTypeSchema.optional(),
  season: productSeasonSchema.optional(),
  category: productCategorySchema.optional(),
})
export type ProductsByFiltersSchema = z.infer<typeof productsByFiltersSchema>

export const adminProductStatusSchema = z
  .enum(['all', 'active', 'draft'])
  .default('all')
export type AdminProductStatusSchema = z.infer<typeof adminProductStatusSchema>

export const adminProductsSchema = productsPaginationSchema.extend({
  visibility: adminProductStatusSchema,
})
export type AdminProductsSchema = z.infer<typeof adminProductsSchema>
