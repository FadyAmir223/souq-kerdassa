import type { Metadata } from 'next'
import { Suspense } from 'react'

import { api, HydrateClient } from '@/trpc/server'

import Spinner from '../_components/spinner'
import UsersList from './_components/users-list'
import UserStatistics from './user-statistics'

export const metadata: Metadata = {
  title: {
    absolute: 'العملاء',
  },
}

const defaultQueryParams = {
  limit: 10,
  page: 1,
}

// search can be done

export default function UsersPage() {
  void Promise.all([
    api.user.admin.count.prefetch(),
    api.user.admin.all.prefetch(defaultQueryParams),
  ])

  return (
    <div className='flex flex-1 flex-col sm:gap-4 sm:py-4 lg:pe-14'>
      <main className='grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <h1 className='text-lg font-semibold md:text-2xl'>العملاء</h1>

        <UserStatistics />

        <HydrateClient>
          <Suspense fallback={<Spinner />}>
            <UsersList />
          </Suspense>
        </HydrateClient>
      </main>
    </div>
  )
}
