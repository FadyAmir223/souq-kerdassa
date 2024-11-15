import type { Metadata } from 'next'

import { HydrateClient } from '@/trpc/server'

import SidebarCollapseButton from '../_components/sidebar-collapse-button'
import CitiesPricing from './_component/cities-pricing'
import GeneralStatistics from './_component/general-statistics'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    absolute: 'الرئيسية',
  },
  description: 'نبذة عن اهم الاحصائيات',
}

export default function Dashboard() {
  return (
    <div className='flex flex-1 flex-col sm:gap-4 sm:py-4 lg:pe-14'>
      <main className='grid items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-semibold md:text-2xl'>العملاء</h1>
          <SidebarCollapseButton />
        </div>

        <GeneralStatistics />

        <HydrateClient>
          <CitiesPricing />
        </HydrateClient>
      </main>
    </div>
  )
}
