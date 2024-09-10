import { cuidSchema, productsByFiltersSchema, reviewSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import {
  getAllProducts,
  getProductById,
  getProductIds,
  getProductsByFilters,
  getProductsByQuery,
  getSimilarProducts,
} from '../data/product'
import { addReview, deleteReview, getReviews } from '../data/review'
import { getPurchaseStatus } from '../data/user'
import { protectedProcedure, publicProcedure } from '../trpc'
import { productByQuerySchema } from '../validations/products'

export const productRouter = {
  all: publicProcedure.query(({ ctx }) => getAllProducts(ctx.db)),
  ids: publicProcedure.query(({ ctx }) => getProductIds(ctx.db)),

  byId: publicProcedure
    .input(cuidSchema)
    .query(({ ctx, input: id }) => getProductById(ctx.db, id)),

  byFilter: publicProcedure
    .input(productsByFiltersSchema)
    .query(async ({ ctx, input }) => getProductsByFilters({ db: ctx.db, ...input })),

  byQuery: publicProcedure
    .input(productByQuerySchema)
    .query(({ ctx, input }) => getProductsByQuery({ db: ctx.db, ...input })),

  // TODO: real correlation
  similar: publicProcedure
    .input(z.number())
    .query(({ ctx, input: limit }) => getSimilarProducts(ctx.db, limit)),

  review: {
    some: publicProcedure
      .input(
        z.object({
          productId: cuidSchema,
          limit: z.coerce.number().default(3),
          page: z.coerce.number().default(1),
        }),
      )
      .query(async ({ ctx, input }) =>
        getReviews({
          db: ctx.db,
          ...input,
        }),
      ),

    add: protectedProcedure
      .input(z.object({ productId: cuidSchema, review: reviewSchema }))
      .mutation(async ({ ctx, input }) => {
        const hasPurchased = await getPurchaseStatus({
          db: ctx.db,
          userId: ctx.session.user.id,
          productId: input.productId,
        })

        if (!hasPurchased)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'اشترى المنتج لتستطيع تقديم مراجعة له',
          })

        await addReview({
          db: ctx.db,
          userId: ctx.session.user.id,
          productId: input.productId,
          review: input.review,
        })
      }),

    delete: protectedProcedure
      .input(cuidSchema)
      .mutation(async ({ ctx, input: productId }) =>
        deleteReview({ db: ctx.db, userId: ctx.session.user.id, productId }),
      ),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord
