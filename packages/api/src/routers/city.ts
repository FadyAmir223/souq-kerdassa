import type { TRPCRouterRecord } from '@trpc/server'

import { getAllCities } from '../data/city'
import { publicProcedure } from '../trpc'

export const cityRouter = {
  all: publicProcedure.query(({ ctx }) => getAllCities(ctx.db)),
} satisfies TRPCRouterRecord
