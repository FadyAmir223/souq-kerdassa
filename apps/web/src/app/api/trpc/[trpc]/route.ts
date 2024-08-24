import { appRouter, createTRPCContext } from '@repo/api'
import { auth } from '@repo/auth'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { env } from '@/lib/env'

const setCorsHeaders = (res: Response) => {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Request-Method', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', '*')
}

const handler = auth(async (req) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () =>
      createTRPCContext({
        session: req.auth,
        headers: req.headers,
      }),
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            // eslint-disable-next-line no-console
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            )
          }
        : undefined,
  })

  setCorsHeaders(response)
  return response
})

export { handler as GET, handler as POST }

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  })
  setCorsHeaders(response)
  return response
}
