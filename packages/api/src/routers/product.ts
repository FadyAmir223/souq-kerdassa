import { cuidSchema, productTypeSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import {
  getAllProducts,
  getProductById,
  getProductsByQuery,
  getProductsBySeasonOrCategory,
  getProductsByType,
  getSimilarProducts,
} from '../data/product'
import { publicProcedure } from '../trpc'

export const productRouter = {
  all: publicProcedure.query(({ ctx }) => getAllProducts(ctx.db)),

  byType: publicProcedure
    .input(
      z.object({
        type: productTypeSchema,
        limit: z.coerce.number(),
        page: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.type === 'latest' || input.type === 'top-rated')
        return getProductsByType({
          db: ctx.db,
          type: input.type,
          limit: input.limit,
          page: input.page,
        })

      return getProductsBySeasonOrCategory({
        db: ctx.db,
        type: input.type,
        limit: input.limit,
        page: input.page,
      })
    }),

  byId: publicProcedure
    .input(cuidSchema)
    .query(({ ctx, input: id }) => getProductById(ctx.db, id)),

  // TODO: real correlation
  similar: publicProcedure
    .input(z.number())
    .query(({ ctx, input: limit }) => getSimilarProducts(ctx.db, limit)),

  byQuery: publicProcedure
    .input(
      z.object({
        query: z.string().trim().min(1),
        limit: z.number(),
        cursor: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => getProductsByQuery({ db: ctx.db, ...input })),
} satisfies TRPCRouterRecord
