import { inputSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'

import { publicProcedure } from '../trpc'

const inputProcedure = publicProcedure.input(inputSchema)

export const todoRouter = {
  get: publicProcedure.query(({ ctx }) => ctx.db.todo.findMany()),

  add: inputProcedure.mutation(async ({ input: { task }, ctx }) => {
    const newTask = await ctx.db.todo.create({
      data: { task },
    })

    return newTask
  }),
} satisfies TRPCRouterRecord
