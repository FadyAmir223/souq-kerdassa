import { z } from 'zod'

import { cartItemSchema } from './cart'
import { addressSchema } from './user'

export const createOrderSchema = z.object({
  address: addressSchema,
  cart: z.array(cartItemSchema),
})
export type CreateOrderSchema = z.infer<typeof createOrderSchema>
