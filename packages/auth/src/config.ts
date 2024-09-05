// TODO: split to: config & config.edge

import { skipCSRFCheck } from '@auth/core'
import Credentials from '@auth/core/providers/credentials'
import Google from '@auth/core/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import db from '@repo/db'
import type { User } from '@repo/db/types'
import { loginFormSchema } from '@repo/validators'
import bcrypt from 'bcryptjs'
import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from 'next-auth'

import { env } from '../env'
import { getUserByPhone } from './data/user'

declare module 'next-auth' {
  interface Session {
    user: {
      id: User['id']
      phone?: User['phone'] // TODO: type me properly
    } & DefaultSession['user']
  }
}

const adapter = PrismaAdapter(db)

export const isSecureContext = env.NODE_ENV !== 'development'

export const authConfig = {
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext ? { skipCSRFCheck, trustHost: true } : {}),

  providers: [
    Google({}),

    Credentials({
      async authorize(credentials) {
        const result = loginFormSchema.safeParse(credentials)
        if (!result.success) return null

        const { phone, password } = result.data

        const user = await getUserByPhone(phone)
        if (!user?.password) return null

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) return null

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
        }
      },
    }),
  ],

  callbacks: {
    session: (opts) => {
      if (!('user' in opts)) throw new Error('unreachable with session strategy')

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      }
    },

    async jwt({ user }) {
      const session = await adapter.createSession?.({
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sessionToken: crypto.randomUUID(),
        userId: user.id!,
      })

      return { id: session?.sessionToken }
    },
  },

  jwt: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async encode({ token }) {
      return token?.id as string
    },
  },

  // TODO: @repo/constants
  pages: {
    newUser: 'register',
    signIn: 'login',
  },
} satisfies NextAuthConfig

export async function validateToken(token: string): Promise<NextAuthSession | null> {
  const sessionToken = token.slice('Bearer '.length)
  const session = await adapter.getSessionAndUser?.(sessionToken)

  return session
    ? {
        user: { ...session.user },
        expires: session.session.expires.toISOString(),
      }
    : null
}

export async function invalidateSessionToken(token: string) {
  await adapter.deleteSession?.(token)
}
