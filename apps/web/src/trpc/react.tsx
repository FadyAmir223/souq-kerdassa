'use client'

import type { AppRouter } from '@repo/api'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCReact,
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpBatchStreamLink,
} from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { useState } from 'react'
import SuperJSON from 'superjson'

import { env } from '@/lib/env'

import { createQueryClient } from './react-query'

const getBaseUrl = () =>
  typeof window !== 'undefined' ? window.location.origin : env.NEXT_PUBLIC_SITE_URL

let clientQueryClientSingleton: QueryClient | undefined = undefined

const getQueryClient = () =>
  typeof window === 'undefined'
    ? createQueryClient()
    : (clientQueryClientSingleton ??= createQueryClient())

export const api = createTRPCReact<AppRouter>()

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>

const httpBatchLinkConfig = {
  transformer: SuperJSON,
  url: `${getBaseUrl()}/api/trpc`,
  headers: () => {
    const headers = new Headers()
    headers.set('x-trpc-source', 'nextjs-react')
    return headers
  },
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            return Boolean(op.context.skipStream)
          },
          false: unstable_httpBatchStreamLink(httpBatchLinkConfig),
          true: httpBatchLink(httpBatchLinkConfig),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  )
}
