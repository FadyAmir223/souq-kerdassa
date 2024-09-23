import type { Metadata } from 'next'
import { Suspense } from 'react'

import { api, HydrateClient } from '@/trpc/server'

import SidebarCollapseButton from '../_components/sidebar-collapse-button'
import Spinner from '../_components/spinner'
import UserStatistics from './_components/user-statistics'
import UsersList from './_components/users-list'

export const metadata: Metadata = {
  title: {
    absolute: 'العملاء',
  },
}

export const dynamic = 'force-dynamic'

const defaultQueryParams = {
  limit: 10,
  page: 1,
}

// search by name or phone can be done

export default function UsersPage() {
  void Promise.all([
    api.user.admin.count.prefetch(),
    api.user.admin.all.prefetch(defaultQueryParams),
  ])

  return (
    <div className='flex flex-1 flex-col sm:gap-4 sm:py-4 lg:pe-14'>
      <main className='grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-semibold md:text-2xl'>العملاء</h1>
          <SidebarCollapseButton />
        </div>

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
