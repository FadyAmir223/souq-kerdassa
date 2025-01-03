import { z } from 'zod'

import { cuidSchema } from './utils'

export const cartItemSchema = z.object({
  id: cuidSchema,
  variantId: cuidSchema,
  size: z.enum(['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL']),
  quantity: z.number().min(1),
})
export type CartItemSchema = z.infer<typeof cartItemSchema>
