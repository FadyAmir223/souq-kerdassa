import {
  addressSchema,
  addressSchemaWithId,
  cuidSchema,
  editProfileSchema,
  paginationSchema,
} from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'

import {
  addAddress,
  deleteAddress,
  editAddress,
  editUserProfile,
  getAddresses,
  getAdminUsers,
  getAdminUsersCount,
  getPurchaseAndReviewStatus,
  getUserStatistics,
} from '../data/user'
import { adminProcedure, protectedProcedure, publicProcedure } from '../trpc'

export const userRouter = {
  editProfile: protectedProcedure
    .input(editProfileSchema)
    .mutation(({ ctx, input }) =>
      editUserProfile(ctx.db, { id: ctx.session.user.id, ...input }),
    ),

  getReviewStatus: publicProcedure
    .input(cuidSchema)
    .query(async ({ ctx, input: productId }) => {
      if (!ctx.session) return { hasPurchased: false, hasReviewed: false }

      return getPurchaseAndReviewStatus({
        db: ctx.db,
        userId: ctx.session.user.id,
        productId,
      })
    }),

  addresses: {
    all: protectedProcedure.query(({ ctx }) =>
      getAddresses(ctx.db, ctx.session.user.id),
    ),

    add: protectedProcedure
      .input(addressSchema)
      .mutation(({ ctx, input: address }) =>
        addAddress({
          db: ctx.db,
          userId: ctx.session.user.id,
          address,
        }),
      ),

    edit: protectedProcedure
      .input(addressSchemaWithId)
      .mutation(({ ctx, input: address }) =>
        editAddress({
          db: ctx.db,
          userId: ctx.session.user.id,
          address,
        }),
      ),

    delete: protectedProcedure
      .input(cuidSchema)
      .mutation(({ ctx, input: addressId }) =>
        deleteAddress({ db: ctx.db, userId: ctx.session.user.id, addressId }),
      ),
  } satisfies TRPCRouterRecord,

  admin: {
    count: adminProcedure.query(({ ctx }) => getAdminUsersCount(ctx.db)),

    all: adminProcedure.input(paginationSchema).query(async ({ ctx, input }) =>
      getAdminUsers({
        db: ctx.db,
        limit: input.limit,
        page: input.page,
      }),
    ),

    statistics: adminProcedure.query(({ ctx }) => getUserStatistics(ctx.db)),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord
