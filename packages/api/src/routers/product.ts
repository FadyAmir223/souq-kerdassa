import type { Product } from '@repo/db/types'
import {
  addProductImagePathsSchema,
  adminProductsSchema,
  adminProductStatusSchema,
  cuidSchema,
  productsByFiltersSchema,
  reviewSchema,
} from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { rm } from 'fs/promises'
import { revalidateTag, unstable_cache } from 'next/cache'
import path from 'path'
import { z } from 'zod'

import {
  addAdminProduct,
  changeProductStatus,
  deleteAdminProduct,
  editAdminProduct,
  getAdminProductDetails,
  getAdminProducts,
  getAdminProductsCount,
  getProductById,
  getProductIds,
  getProductsByFilters,
  getProductsByQuery,
  getSimilarProducts,
} from '../data/product'
import { addReview, deleteReview, getReviews } from '../data/review'
import { getPurchaseStatus } from '../data/user'
import { adminProcedure, protectedProcedure, publicProcedure } from '../trpc'
import { productByQuerySchema } from '../validations/products'

export const productRouter = {
  ids: publicProcedure.query(({ ctx }) => getProductIds(ctx.db)),

  byId: publicProcedure.input(cuidSchema).query(({ ctx, input: id }) =>
    unstable_cache(() => getProductById(ctx.db, id), ['product', 'byId', id], {
      tags: ['product.byId', id],
    })(),
  ),

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

  review: {
    some: publicProcedure
      .input(
        z.object({
          productId: cuidSchema,
          limit: z.coerce.number().default(3),
          page: z.coerce.number().default(1),
        }),
      )
      .query(async ({ ctx, input }) => getReviews({ db: ctx.db, ...input })),

    add: protectedProcedure
      .input(z.object({ productId: cuidSchema, review: reviewSchema }))
      .mutation(async ({ ctx, input }) => {
        const hasPurchased = await getPurchaseStatus({
          db: ctx.db,
          userId: ctx.session.user.id,
          productId: input.productId,
        })

        if (!hasPurchased)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'اشترى المنتج لتستطيع تقديم مراجعة له',
          })

        await addReview({
          db: ctx.db,
          userId: ctx.session.user.id,
          productId: input.productId,
          review: input.review,
        })
      }),

    delete: protectedProcedure
      .input(cuidSchema)
      .mutation(async ({ ctx, input: productId }) =>
        deleteReview({ db: ctx.db, userId: ctx.session.user.id, productId }),
      ),
  } satisfies TRPCRouterRecord,

  admin: {
    count: adminProcedure
      .input(adminProductStatusSchema)
      .query(async ({ ctx, input: visibility }) =>
        getAdminProductsCount(ctx.db, visibility !== 'all' ? visibility : undefined),
      ),

    all: adminProcedure.input(adminProductsSchema).query(async ({ ctx, input }) =>
      getAdminProducts({
        db: ctx.db,
        limit: input.limit,
        page: input.page,
        visibility: input.visibility !== 'all' ? input.visibility : undefined,
      }),
    ),

    detailsById: adminProcedure
      .input(cuidSchema)
      .query(async ({ ctx, input: productId }) =>
        getAdminProductDetails(ctx.db, productId),
      ),

    changeStatus: adminProcedure
      .input(
        z.object({
          productId: cuidSchema,
          visibility: adminProductStatusSchema,
        }),
      )
      .mutation(async ({ ctx, input }) =>
        changeProductStatus({
          db: ctx.db,
          productId: input.productId,
          visibility: input.visibility as Product['visibility'],
        }),
      ),

    add: adminProcedure
      .input(addProductImagePathsSchema)
      .mutation(async ({ ctx, input: newProduct }) =>
        addAdminProduct(ctx.db, newProduct),
      ),

    edit: adminProcedure
      .input(addProductImagePathsSchema)
      .mutation(async ({ ctx, input: newProduct }) => {
        await editAdminProduct(ctx.db, newProduct)
        revalidateTag(newProduct.id!)
      }),

    delete: adminProcedure
      .input(cuidSchema)
      .mutation(async ({ ctx, input: productId }) => {
        const imagePath = await deleteAdminProduct(ctx.db, productId)
        revalidateTag(productId)
        const imagesDir = path.dirname(imagePath)
        await rm(imagesDir, { recursive: true, force: true })
      }),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord
