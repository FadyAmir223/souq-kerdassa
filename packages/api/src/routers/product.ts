import { cuidSchema, productsByFiltersSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import {
  getAllProducts,
  getProductById,
  getProductsByFilters,
  getProductsByQuery,
  getSimilarProducts,
} from '../data/product'
import { publicProcedure } from '../trpc'

export const productRouter = {
  all: publicProcedure.query(({ ctx }) => getAllProducts(ctx.db)),

  byType: publicProcedure
    .input(productsByFiltersSchema)
    .query(async ({ ctx, input }) => getProductsByFilters({ db: ctx.db, ...input })),

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
