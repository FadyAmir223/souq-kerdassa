'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

export default function RedirectToCheckoutButton() {
  const addresses = api.user.addresses.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  const searchParams = useSearchParams()
  const isPurchasing =
    searchParams.get(SEARCH_PARAMS.redirectTo) === PAGES.protected.buy.checkout

  if (!isPurchasing || addresses.data?.length === 0) return null

  return (
    <div className='mt-8 text-center'>
      <Button asChild size='lg' className='text-lg'>
        <Link href={PAGES.protected.buy.checkout}>اكمل الشراء</Link>
      </Button>
    </div>
  )
}
