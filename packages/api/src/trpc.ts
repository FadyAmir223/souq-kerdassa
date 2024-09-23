import type { Session } from '@repo/auth'
import { auth, validateToken } from '@repo/auth'
import db from '@repo/db'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'

const isomorphicGetSession = async (headers: Headers) => {
  const authToken = headers.get('Authorization') ?? null

  if (authToken) return validateToken(authToken)
  return auth()
}

export const createTRPCContext = async (opts: {
  headers: Headers
  session: Session | null
}) => {
  const authToken = opts.headers.get('Authorization') ?? null
  // TODO: remove after migrating admin to next-auth
  const token = authToken?.startsWith('Basic') ? null : authToken

  const session = await isomorphicGetSession(opts.headers)

  if (process.env.NODE_ENV === 'development') {
    const source = opts.headers.get('x-trpc-source') ?? 'unknown'
    console.log('>>> tRPC Request from', source, 'by', session?.user)
  }

  return { session, db, token }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        cause: error.cause instanceof Error ? { ...error.cause } : null,
      },
    }
  },
})

export const createCallerFactory = t.createCallerFactory
export const createTRPCRouter = t.router

const timingMiddleware = t.middleware(async ({ next }) => {
  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  return next()
})

export const publicProcedure = t.procedure.use(timingMiddleware)

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' })

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * adminProcedure is currently not secure
 * if we added an admin split link and added an isAdmin: true cookie
 * it would be noticed by reading the bundle code although it's a big filter
 *
 * basic auth:
 *   pros: accessible from next.js middleware
 *   cons: not accessible from the browser (via react-query)
 *
 * next-auth:
 *   pros: accessible from trpc middleware
 *   cons: next.js middleware can't access role from db session on the edge
 *
 * TODO:
 *   during next-auth login set isAdmin cookie which next.js middleware can check
 */

export const adminProcedure = t.procedure.use(timingMiddleware).use(({ next }) => {
  return next()
})
