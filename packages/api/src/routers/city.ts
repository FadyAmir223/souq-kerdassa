import { cityCategorySchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'

import { getAllCategories, getAllCities, updateCategoryPrice } from '../data/city'
import { adminProcedure, publicProcedure } from '../trpc'

export const cityRouter = {
  all: publicProcedure.query(({ ctx }) => getAllCities(ctx.db)),

  category: {
    all: publicProcedure.query(async ({ ctx }) => getAllCategories(ctx.db)),

    update: adminProcedure
      .input(cityCategorySchema)
      .mutation(async ({ ctx, input: categories }) =>
        updateCategoryPrice(ctx.db, categories),
      ),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord
