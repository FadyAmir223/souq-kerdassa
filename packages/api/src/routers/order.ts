import { createOrderSchema, cuidSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { cancelOrder, createOrder, getOrders } from '../data/order'
import { getSoldOutVariants } from '../data/product'
import { protectedProcedure } from '../trpc'

export const ordersRouter = {
  all: protectedProcedure.query(async ({ ctx }) =>
    getOrders(ctx.db, ctx.session.user.id),
  ),

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

  // maybe permit canceling just for a certain duration
  cancel: protectedProcedure
    .input(cuidSchema)
    .mutation(async ({ ctx, input: orderId }) =>
      cancelOrder({
        db: ctx.db,
        userId: ctx.session.user.id,
        orderId,
      }),
    ),
} satisfies TRPCRouterRecord
