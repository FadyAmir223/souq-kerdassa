import { cuidSchema, ProductTypeSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import {
  getAllProducts,
  getLatestProducts,
  getProductById,
  getProductsByQuery,
  getProductsBySeason,
  getSimilarProducts,
} from '../data/product'
import { publicProcedure } from '../trpc'

export const productRouter = {
  all: publicProcedure.query(({ ctx }) => getAllProducts(ctx.db)),

  byCategory: publicProcedure
    .input(ProductTypeSchema)
    .query(async ({ ctx, input: type }) =>
      type === 'LATEST'
        ? getLatestProducts(ctx.db)
        : getProductsBySeason(ctx.db, type),
    ),

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
        cursor: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => getProductsByQuery({ db: ctx.db, ...input })),
} satisfies TRPCRouterRecord
