import { cityCategorySchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { revalidateTag, unstable_cache } from 'next/cache'

import { getAllCategories, getAllCities, updateCategoryPrice } from '../data/city'
import { adminProcedure, publicProcedure } from '../trpc'

export const cityRouter = {
  all: publicProcedure.query(({ ctx }) =>
    unstable_cache(() => getAllCities(ctx.db), ['city', 'all'], {
      tags: ['city.all'],
    })(),
  ),

  category: {
    all: publicProcedure.query(({ ctx }) =>
      unstable_cache(() => getAllCategories(ctx.db), ['city', 'category', 'all'], {
        tags: ['city.all'],
      })(),
    ),

    update: adminProcedure
      .input(cityCategorySchema)
      .mutation(async ({ ctx, input: categories }) => {
        await updateCategoryPrice(ctx.db, categories)
        revalidateTag('city.all')
      }),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord
