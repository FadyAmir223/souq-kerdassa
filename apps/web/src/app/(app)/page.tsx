import type { Season } from '@repo/db/types'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import Ad from './_components/ad'
import ImageSlider from './_components/image-slider'
import ProductList from './_components/product/product-list'

const seasonProducts = [
  { label: 'منتجات الصيف', season: 'SUMMER' },
  { label: 'منتجات الشتاء', season: 'WINTER' },
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
              <Link href='/products?type=latest'>عرض الكل</Link>
            </Button>
          </div>

          <ProductList type='LATEST' />
        </div>

        <Ad />
      </section>

      {seasonProducts.map(({ label, season }) => (
        <section key={season} className='pt-14'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='mb-3 text-xl font-bold tracking-wider'>{label}</h2>
            <Button asChild variant='link' className='font-semibold'>
              <Link href={`/products?type=${season.toLowerCase()}`}>عرض الكل</Link>
            </Button>
          </div>

          <ProductList type={season} />
        </section>
      ))}
    </main>
  )
}
