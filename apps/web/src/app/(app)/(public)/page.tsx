import type { Season } from '@repo/db/types'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/utils/constants'

import Ad from './_components/ad'
import ImageSlider from './_components/image-slider'
import ProductMiniList from './_components/product/product-list'

const seasonProducts = [
  { label: 'منتجات الصيف', season: 'summer' },
  { label: 'منتجات الشتاء', season: 'winter' },
] satisfies { label: string; season: Season }[]

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className='container'>
      <ImageSlider />

      <section className='flex flex-col gap-4 py-14 lg:flex-row'>
        <div className='flex-1'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='mb-3 text-xl font-bold tracking-wider'>احدث المنتجات</h2>
            <Button asChild variant='link' className='font-semibold'>
              <Link href={`${PAGES.public.products}?type=latest`}>عرض الكل</Link>
            </Button>
          </div>

          <ProductMiniList type='latest' />
        </div>

        <Ad />
      </section>

      {seasonProducts.map(({ label, season }) => (
        <section key={season} className='pt-14'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='mb-3 text-xl font-bold tracking-wider'>{label}</h2>
            <Button asChild variant='link' className='font-semibold'>
              <Link href={`${PAGES.public.products}?type=${season}`}>عرض الكل</Link>
            </Button>
          </div>

          <ProductMiniList type={season} />
        </section>
      ))}
    </main>
  )
}
