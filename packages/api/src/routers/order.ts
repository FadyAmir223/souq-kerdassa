import type { OrderStatus } from '@repo/db/types'
import {
  adminOrdersSchema,
  adminOrderStatusSchema,
  createOrderSchema,
  cuidSchema,
} from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import {
  cancelOrder,
  changeOrderStatus,
  createOrder,
  getAdminOrderDetails,
  getAdminOrders,
  getAdminOrdersCount,
  getOrderAllTimeStatistics,
  getOrders,
  getOrderStatistics,
} from '../data/order'
import { getSoldOutVariants } from '../data/product'
import { adminProcedure, protectedProcedure } from '../trpc'

export const ordersRouter = {
  all: protectedProcedure.query(({ ctx }) => getOrders(ctx.db, ctx.session.user.id)),

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

      const productIds = await createOrder({
        db: ctx.db,
        userId: ctx.session.user.id,
        address: input.address,
        cart: input.cart,
      })

      productIds.forEach((id) => revalidateTag(id))
    }),

  // TODO: maybe permit canceling just for a certain duration
  cancel: protectedProcedure
    .input(cuidSchema)
    .mutation(async ({ ctx, input: orderId }) => {
      const productIds = await cancelOrder({
        db: ctx.db,
        userId: ctx.session.user.id,
        orderId,
      })

      productIds.forEach((id) => revalidateTag(id))
    }),

  admin: {
    count: adminProcedure
      .input(adminOrderStatusSchema)
      .query(({ ctx, input: status }) =>
        getAdminOrdersCount(ctx.db, status !== 'all' ? status : undefined),
      ),

    all: adminProcedure.input(adminOrdersSchema).query(({ ctx, input }) =>
      getAdminOrders({
        db: ctx.db,
        limit: input.limit,
        page: input.page,
        status: input.status !== 'all' ? input.status : undefined,
      }),
    ),

    detailsById: adminProcedure
      .input(cuidSchema)
      .query(({ ctx, input: orderId }) => getAdminOrderDetails(ctx.db, orderId)),

    statistics: adminProcedure.query(({ ctx }) => getOrderStatistics(ctx.db)),

    allTimeStatistics: adminProcedure.query(({ ctx }) =>
      getOrderAllTimeStatistics(ctx.db),
    ),

    changeStatus: adminProcedure
      .input(
        z.object({
          orderId: cuidSchema,
          oldStatus: adminOrderStatusSchema,
          newStatus: adminOrderStatusSchema,
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const productIds = await changeOrderStatus({
          db: ctx.db,
          orderId: input.orderId,
          oldStatus: input.oldStatus as OrderStatus,
          newStatus: input.newStatus as OrderStatus,
        })

        productIds.forEach((id) => revalidateTag(id))
      }),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord
