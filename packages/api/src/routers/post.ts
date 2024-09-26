import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import { publicProcedure } from '../trpc'

const posts: { title: string; content: string; id: string }[] = []

export const postRouter = {
  all: publicProcedure.query(() => {
    return posts
  }),

  byId: publicProcedure.input(z.string()).query(({ input }) => {
    return posts.find((post) => post.id === input)
  }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const newPost = {
        id: crypto.randomUUID(),
        title: input.title,
        content: input.content,
      }
      posts.push(newPost)
      return newPost
    }),

  delete: publicProcedure.input(z.string()).mutation(({ input }) => {
    const postIndex = posts.findIndex((post) => post.id === input)
    return posts.splice(postIndex, 1)[0]
  }),
} satisfies TRPCRouterRecord
