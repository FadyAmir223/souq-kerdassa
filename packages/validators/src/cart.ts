import { z } from 'zod'

import { colorSchema } from './product'
import { cuidSchema } from './utils'

export const cartItemSchema = z.object({
  id: cuidSchema,
  variantId: cuidSchema,
  size: z.enum(['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL']),
  color: colorSchema,
  quantity: z.number().min(1),
})
export type CartItemSchema = z.infer<typeof cartItemSchema>
