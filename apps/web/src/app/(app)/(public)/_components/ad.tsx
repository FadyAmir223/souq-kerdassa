import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { api } from '@/trpc/server'
import { PAGES } from '@/utils/constants'

import ProductCard from './product/product-card'

export default async function Ad() {
  const { products } = await api.product.byFilter({ type: 'latest', limit: 1 })
  const [product] = products

  if (!product) return null

  return (
    <div className='h-fit rounded-md bg-primary p-6 md:min-w-full lg:min-w-80'>
      <h4 className='my-8 text-center text-3xl font-bold text-white'>منتج مقترح</h4>
      <ProductCard product={product} className='bg-white p-6' />

      <div className='text-center'>
        <Button
          asChild
          variant='secondary'
          className='mt-6 text-xl font-bold hover:bg-secondary/90'
          size='lg'
        >
          <Link href={PAGES.public.product(product.id)}>اشترى الآن</Link>
        </Button>
      </div>
    </div>
  )
}
