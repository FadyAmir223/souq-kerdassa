import { z } from 'zod'

import { cartItemSchema } from './cart'
import { addressSchema } from './user'
import { paginationSchema } from './utils'

export const createOrderSchema = z.object({
  address: addressSchema,
  cart: z.array(cartItemSchema),
})
export type CreateOrderSchema = z.infer<typeof createOrderSchema>

export const adminOrderStatusSchema = z
  .enum(['all', 'pending', 'completed', 'cancelled', 'refunded'])
  .default('all')
export type AdminOrderStatusSchema = z.infer<typeof adminOrderStatusSchema>

export const adminOrdersSchema = paginationSchema.extend({
  status: adminOrderStatusSchema,
})
export type AdminOrdersSchema = z.infer<typeof adminOrdersSchema>
