import type { OrderStatus } from '@repo/db/types'
import {
  adminOrdersSchema,
  adminOrderStatusSchema,
  createOrderSchema,
  cuidSchema,
} from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'
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

      await createOrder({
        db: ctx.db,
        userId: ctx.session.user.id,
        address: input.address,
        cart: input.cart,
      })
    }),

  // TODO: maybe permit canceling just for a certain duration
  cancel: protectedProcedure
    .input(cuidSchema)
    .mutation(async ({ ctx, input: orderId }) =>
      cancelOrder({
        db: ctx.db,
        userId: ctx.session.user.id,
        orderId,
      }),
    ),

  admin: {
    count: adminProcedure
      .input(adminOrderStatusSchema)
      .query(async ({ ctx, input: status }) =>
        getAdminOrdersCount(ctx.db, status !== 'all' ? status : undefined),
      ),

    all: adminProcedure.input(adminOrdersSchema).query(async ({ ctx, input }) =>
      getAdminOrders({
        db: ctx.db,
        limit: input.limit,
        page: input.page,
        status: input.status !== 'all' ? input.status : undefined,
      }),
    ),

    detailsById: adminProcedure
      .input(cuidSchema)
      .query(async ({ ctx, input: orderId }) =>
        getAdminOrderDetails(ctx.db, orderId),
      ),

    statistics: adminProcedure.query(async ({ ctx }) => getOrderStatistics(ctx.db)),

    allTimeStatistics: adminProcedure.query(async ({ ctx }) =>
      getOrderAllTimeStatistics(ctx.db),
    ),

    changeStatus: adminProcedure
      .input(
        z.object({
          orderId: cuidSchema,
          status: adminOrderStatusSchema,
        }),
      )
      .mutation(async ({ ctx, input }) =>
        changeOrderStatus({
          db: ctx.db,
          orderId: input.orderId,
          status: input.status as OrderStatus,
        }),
      ),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord
