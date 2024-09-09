import type { DB, Product, User } from '@repo/db/types'
import type { ReviewSchema } from '@repo/validators'
import { TRPCError } from '@trpc/server'

export async function getReviews({
  db,
  productId,
  limit,
  page,
}: {
  db: DB
  productId: Product['id']
  limit: number
  page: number
}) {
  try {
    return await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        rating: true,
        reviewsCount: true,
        reviews: {
          where: {
            message: {
              not: '',
            },
          },
          select: {
            id: true,
            rating: true,
            message: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: limit,
          skip: (page - 1) * limit,
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}

export async function addReview({
  db,
  userId,
  productId,
  review,
}: {
  db: DB
  userId: User['id']
  productId: Product['id']
  review: ReviewSchema
}) {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        rating: true,
        reviewsCount: true,
      },
    })

    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'المنتج ليس موجود',
      })

    await db.$transaction([
      db.review.create({
        data: {
          userId,
          productId,
          rating: review.rating,
          message: review.message,
        },
        select: {
          id: true,
        },
      }),

      db.product.update({
        where: {
          id: productId,
        },
        data: {
          reviewsCount: {
            increment: 1,
          },
          rating:
            (product.rating * product.reviewsCount + review.rating) /
            (product.reviewsCount + 1),
        },
        select: {
          id: true,
        },
      }),
    ])
  } catch (error) {
    if (error instanceof TRPCError) throw error

    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المنتج ليس موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر إضافة المراجعة',
    })
  }
}

export async function deleteReview({
  db,
  userId,
  productId,
}: {
  db: DB
  userId: User['id']
  productId: Product['id']
}) {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        rating: true,
        reviewsCount: true,
        reviews: {
          where: {
            userId,
          },
          select: {
            rating: true,
          },
          take: 1,
        },
      },
    })

    if (!product)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'المنتج ليس موجود',
      })

    if (!product.reviews[0]?.rating)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'المراجعة ليست موجودة',
      })

    await db.$transaction([
      db.review.delete({
        where: {
          productId_userId: { productId, userId },
        },
        select: {
          id: true,
        },
      }),

      db.product.update({
        where: {
          id: productId,
        },
        data: {
          reviewsCount: {
            decrement: 1,
          },
          rating:
            product.reviewsCount > 1
              ? (product.rating * product.reviewsCount -
                  product.reviews[0]?.rating) /
                (product.reviewsCount - 1)
              : 0,
        },
        select: {
          id: true,
        },
      }),
    ])
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المراجعة ليست موجودة',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر مسح المراجعة',
    })
  }
}
