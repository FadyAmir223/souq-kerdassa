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
import { productByQuerySchema } from '../validations/products'

export const productRouter = {
  all: publicProcedure.query(({ ctx }) => getAllProducts(ctx.db)),

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
} satisfies TRPCRouterRecord
