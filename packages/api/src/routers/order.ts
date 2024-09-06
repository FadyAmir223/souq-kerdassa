import { createOrderSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'

import { getSoldOutProducts } from '../data/product'
import { protectedProcedure } from '../trpc'

export const ordersRouter = {
  create: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      // check items exist
      // const soldOutProducts =
      await getSoldOutProducts(ctx.db, input.cart)
      // if (soldOutProducts) return { error: { soldOutProducts } }

      // save order  user, address, product, productVariant
      // decrement the count from variants
    }),
} satisfies TRPCRouterRecord
