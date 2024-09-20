import { z } from 'zod'

import { cuidSchema } from './utils'

export const cartItemSchema = z.object({
  id: cuidSchema,
  variantId: cuidSchema,
  quantity: z.number().min(1),
})
