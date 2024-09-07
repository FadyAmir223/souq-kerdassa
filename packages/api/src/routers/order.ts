import { createOrderSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { createOrder } from '../data/order'
import { getSoldOutVariants } from '../data/product'
import { protectedProcedure } from '../trpc'

export const ordersRouter = {
  create: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const soldOutVariants = await getSoldOutVariants(ctx.db, input.cart)

      if (soldOutVariants.length !== 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'الكمية المطلوبة غير متوفرة من بعض المنتجات',
          cause: { soldOutVariants },
        })

      const orderId = await createOrder({
        db: ctx.db,
        userId: ctx.session.user.id,
        address: input.address,
        cart: input.cart,
      })

      return orderId
    }),
} satisfies TRPCRouterRecord
