import { z } from 'zod'

import { cuidSchema } from './id'
import { productCategorySchema, productSeasonSchema } from './product'

export const cartItemSchema = z.object({
  id: cuidSchema,
  name: z.string().min(1),
  image: z.string().min(1),
  price: z.number().min(1),
  season: productSeasonSchema,
  category: productCategorySchema,
  quantity: z.number().min(1),
})
