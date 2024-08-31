import { cuidSchema, productsByFiltersSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import {
  getAllProducts,
  getProductById,
  getProductsByFilters,
  getProductsByQuery,
  getSampleProducts,
  getSimilarProducts,
} from '../data/product'
import { publicProcedure } from '../trpc'
import { productByQuerySchema, sampleProductsSchema } from '../validations/products'

export const productRouter = {
  all: publicProcedure.query(({ ctx }) => getAllProducts(ctx.db)),

  sample: publicProcedure
    .input(sampleProductsSchema)
    .query(({ ctx, input }) => getSampleProducts({ db: ctx.db, ...input })),

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
    .input(productByQuerySchema)
    .query(({ ctx, input }) => getProductsByQuery({ db: ctx.db, ...input })),
} satisfies TRPCRouterRecord
