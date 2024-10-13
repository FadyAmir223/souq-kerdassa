import { invalidateSessionToken } from '@repo/auth'
import { loginFormSchema, registerFormSchema } from '@repo/validators'
import type { TRPCRouterRecord } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { cookies, headers } from 'next/headers'

import { createUser } from '../data/user'
import { protectedProcedure, publicProcedure } from '../trpc'
import { credentialsSignIn } from '../utils/auth'

const mobileSessionId = () => {
  const isMobile = headers().get('x-trpc-source') === 'expo-react'
  if (isMobile) return cookies().get('authjs.session-token')?.value
}

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => ctx.session),

  register: publicProcedure
    .input(registerFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.token) return { success: false }
      const { name, phone, password } = input
      // TODO: @repo/constants bcryptSalt
      const hashedPassword = await bcrypt.hash(password, 10)

      await createUser(ctx.db, { name, phone, password: hashedPassword })
      await credentialsSignIn({ phone, password })

      return {
        success: true,
        sessionId: mobileSessionId(),
      }
    }),

  login: publicProcedure.input(loginFormSchema).mutation(async ({ ctx, input }) => {
    if (ctx.token) return { success: false }
    await credentialsSignIn(input)

    if (ctx.session?.user.role === 'ADMIN')
      cookies().set('isAdmin', 'true', {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'lax',
      })

    return {
      success: true,
      sessionId: mobileSessionId(),
    }
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.token) return { success: false }
    await invalidateSessionToken(ctx.token)

    if (ctx.session.user.role === 'ADMIN') cookies().delete('isAdmin')

    return { success: true }
  }),
} satisfies TRPCRouterRecord
