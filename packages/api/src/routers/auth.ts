import { invalidateSessionToken } from '@repo/auth'
import { registerFormSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import bcrypt from 'bcryptjs'

import { createUser } from '../data/user'
import { protectedProcedure, publicProcedure } from '../trpc'
import { credentialSignIn } from '../utils/auth'

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => ctx.session),

  register: publicProcedure
    .input(registerFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, phone, password } = input

      // TODO: @repo/constants bcryptSalt
      const hashedPassword = await bcrypt.hash(password, 10)

      await createUser(ctx.db, { name, phone, password: hashedPassword })
      await credentialSignIn({ phone, password })
    }),

  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.token) return { success: false }
    await invalidateSessionToken(opts.ctx.token)
    return { success: true }
  }),
} satisfies TRPCRouterRecord
