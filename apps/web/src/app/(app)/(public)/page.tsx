import type { ProductsByFiltersSchema } from '@repo/validators'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/utils/constants'

import Ad from './_components/ad'
import ImageSlider from './_components/image-slider'
import ProductMiniList from './_components/product/product-mini-list'

const seasonProducts = [
  { label: 'احدث المنتجات', filter: { type: 'latest', limit: 8 } },
  { label: 'عبايات النساء', filter: { category: 'women' } },
  { label: 'عبايات الاطفال', filter: { category: 'children' } },
] satisfies {
  label: string
  filter: ProductsByFiltersSchema
}[]

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className='container'>
      <ImageSlider />

      {seasonProducts.map(({ label, filter }) => (
        <section key={label} className='flex flex-col gap-4 py-14 lg:flex-row'>
          <div className='flex-1'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='mb-3 text-xl font-bold'>{label}</h2>
              <Button asChild variant='link' className='font-semibold'>
                <Link
                  href={`${PAGES.public.products}?${Object.keys(filter)[0]}=${Object.values(filter)[0]}`}
                >
                  عرض الكل
                </Link>
              </Button>
            </div>

            <ProductMiniList filter={filter} />
          </div>

          {filter.type === 'latest' && <Ad />}
        </section>
      ))}
    </main>
  )
}
