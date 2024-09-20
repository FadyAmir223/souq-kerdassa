import { Suspense } from 'react'

import { HydrateClient } from '@/trpc/server'

import Spinner from '../_components/spinner'
import CitiesPricing from './_component/cities-pricing'
import GeneralStatistics from './_component/general-statistics'

export default function Dashboard() {
  return (
    <div className='flex flex-1 flex-col sm:gap-4 sm:py-4 lg:pe-14'>
      <main className='grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <h1 className='text-lg font-semibold md:text-2xl'>العملاء</h1>

        <GeneralStatistics />

        <HydrateClient>
          <Suspense fallback={<Spinner />}>
            <CitiesPricing />
          </Suspense>
        </HydrateClient>
      </main>
    </div>
  )
}
