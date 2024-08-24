import 'server-only'

import type { AppRouter } from '@repo/api'
import { createCaller, createTRPCContext } from '@repo/api'
import { auth } from '@repo/auth'
import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { headers } from 'next/headers'
import { cache } from 'react'

import { createQueryClient } from './react-query'

const createContext = cache(async () => {
  const heads = new Headers(headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    session: await auth(),
    headers: heads,
  })
})

const getQueryClient = cache(createQueryClient)
const caller = createCaller(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
)
