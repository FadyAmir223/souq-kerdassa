import {
  addressSchema,
  addressSchemaWithId,
  cuidSchema,
  editProfileSchema,
} from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'

import {
  addAddress,
  deleteAddress,
  editAddress,
  editUserProfile,
  getAddresses,
} from '../data/user'
import { protectedProcedure } from '../trpc'

export const userRouter = {
  editProfile: protectedProcedure
    .input(editProfileSchema)
    .mutation(async ({ ctx, input }) =>
      editUserProfile(ctx.db, { id: ctx.session.user.id, ...input }),
    ),

  addresses: {
    all: protectedProcedure.query(async ({ ctx }) =>
      getAddresses(ctx.db, ctx.session.user.id),
    ),

    add: protectedProcedure
      .input(addressSchema)
      .mutation(async ({ ctx, input: address }) =>
        addAddress({
          db: ctx.db,
          userId: ctx.session.user.id,
          address,
        }),
      ),

    edit: protectedProcedure
      .input(addressSchemaWithId)
      .mutation(async ({ ctx, input: address }) =>
        editAddress({
          db: ctx.db,
          userId: ctx.session.user.id,
          address,
        }),
      ),

    delete: protectedProcedure
      .input(cuidSchema)
      .mutation(async ({ ctx, input: addressId }) =>
        deleteAddress({ db: ctx.db, userId: ctx.session.user.id, addressId }),
      ),
  } satisfies TRPCRouterRecord,
} satisfies TRPCRouterRecord