import { z } from 'zod'

import { colorSchema, productSeasonSchema, productSizeSchema } from './product'
import { cuidSchema } from './utils'

export const cartItemSchema = z.object({
  id: cuidSchema,
  variantId: cuidSchema,
  size: productSizeSchema,
  color: colorSchema,
  season: productSeasonSchema,
  quantity: z.number().min(1),
})
export type CartItemSchema = z.infer<typeof cartItemSchema>
