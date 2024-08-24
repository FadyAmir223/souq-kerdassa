import { Suspense } from 'react'

import { AuthShowcase } from '@/components/auth-showcase'
import Todos from '@/components/todos'
import ZustandShowcase from '@/components/zustand-showcase'
import { api, HydrateClient } from '@/trpc/server'

export default function IndexPage() {
  void api.todo.get.prefetch()

  return (
    <HydrateClient>
      <main>
        <AuthShowcase />
        <ZustandShowcase />

        <Suspense
          fallback={
            <>
              <div>loading...</div>
              <div>loading...</div>
              <div>loading...</div>
            </>
          }
        >
          <Todos />
        </Suspense>
      </main>
    </HydrateClient>
  )
}
