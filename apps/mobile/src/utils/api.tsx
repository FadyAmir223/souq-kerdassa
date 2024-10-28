import type { AppRouter } from '@repo/api'
import { useCombinedStore } from '@repo/store/mobile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useEffect, useState } from 'react'
import superjson from 'superjson'

import { getToken } from './auth/session-store'
import { getBaseUrl } from './base-url'

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>()
export { type RouterInputs, type RouterOutputs } from '@repo/api'

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const client = api.createClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
        colorMode: 'ansi',
      }),
      httpBatchLink({
        transformer: superjson,
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          const headers = new Map<string, string>()
          headers.set('x-trpc-source', 'expo-react')

          const token = getToken()
          if (token) headers.set('Authorization', `Bearer ${token}`)
          return Object.fromEntries(headers)
        },
      }),
    ],
  })

  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient, setTrpcClient] = useState(() => client)

  const isLoggedIn = useCombinedStore((s) => s.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) return
    setTrpcClient(client)
  }, [isLoggedIn]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}
