import Image from 'next/image'
import { Suspense } from 'react'

import qualityImage from '@/public/assets/images/icons/quality.png'
import returnImage from '@/public/assets/images/icons/return.png'

import ProductRelates from './product-relates'
import RecommendedProductSkeleton from './recommended-product-skeleton'

export default function ProductSidebar() {
  return (
    <aside className='order-3 w-full md:order-none md:w-fit lg:w-72'>
      <div className='h-fit space-y-6 rounded-lg bg-white p-4'>
        <div className='flex items-center gap-x-2'>
          <Image src={qualityImage} alt='quality' className='w-8' />
          <span className=''>سياسة الإرجاع لمدة 7 ايام</span>
        </div>
        <div className='flex items-center gap-x-2'>
          <Image src={returnImage} alt='return' className='w-8' />
          <span className=''>منتجات اصلية 100%</span>
        </div>
      </div>

      <div className='mt-8'>
        <h3 className='mb-3 text-center text-lg font-bold tracking-wider'>
          مقترحة لك
        </h3>
        <div className='space-y-3'>
          <Suspense
            fallback={
              <>
                <RecommendedProductSkeleton />
                <RecommendedProductSkeleton />
              </>
            }
          >
            <ProductRelates />
          </Suspense>
        </div>
      </div>
    </aside>
  )
}
