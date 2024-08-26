import { cuidSchema, ProductTypeSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'

import { publicProcedure } from '../trpc'

export const productRouter = {
  all: publicProcedure.query(({ ctx }) =>
    ctx.db.product.findMany({
      select: {
        id: true,
        images: true,
        name: true,
        price: true,
        rating: true,
      },
      take: 10,
    }),
  ),

  byCategory: publicProcedure
    .input(ProductTypeSchema)
    .query(async ({ ctx, input: type }) => {
      if (type === 'LATEST')
        return ctx.db.product.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            images: true,
            name: true,
            price: true,
            rating: true,
            _count: {
              select: {
                reviews: true,
              },
            },
          },
          take: 10,
        })

      return ctx.db.product.findMany({
        where: {
          variants: {
            some: {
              season: type,
            },
          },
        },
        select: {
          id: true,
          images: true,
          name: true,
          price: true,
          rating: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        take: 10,
      })
    }),

  byId: publicProcedure.input(cuidSchema).query(({ ctx, input: id }) =>
    ctx.db.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        images: true,
        name: true,
        price: true,
        rating: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    }),
  ),
} satisfies TRPCRouterRecord
