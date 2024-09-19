import { z } from 'zod'

import { cartItemSchema } from './cart'
import { addressSchema } from './user'

export const createOrderSchema = z.object({
  address: addressSchema,
  cart: z.array(cartItemSchema),
})
export type CreateOrderSchema = z.infer<typeof createOrderSchema>

const ordersPaginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
})

export const adminOrderStatusSchema = z
  .enum(['all', 'pending', 'completed', 'cancelled', 'refunded'])
  .default('all')
export type AdminOrderStatusSchema = z.infer<typeof adminOrderStatusSchema>

export const adminOrdersSchema = ordersPaginationSchema.extend({
  status: adminOrderStatusSchema,
})
export type AdminOrdersSchema = z.infer<typeof adminOrdersSchema>
