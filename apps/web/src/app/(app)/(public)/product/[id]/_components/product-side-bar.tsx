import type { RouterOutputs } from '@repo/api'
import Image from 'next/image'
import Link from 'next/link'

import StarRating from '@/app/(app)/(public)/_components/star-rating'
import ImageApi from '@/components/image'
import qualityImage from '@/public/assets/images/icons/quality.png'
import returnImage from '@/public/assets/images/icons/return.png'

type ProductSideBarProps = {
  recommendedProducts: RouterOutputs['product']['similar']
}

export default function ProductSideBar({
  recommendedProducts,
}: ProductSideBarProps) {
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
          {recommendedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className='flex h-36 justify-between gap-x-2 rounded-md bg-white p-2'
            >
              <div className='relative aspect-[83/100]'>
                <ImageApi
                  src={product.image!}
                  alt={product.name}
                  fill
                  sizes='9rem'
                  className='object-cover'
                />
              </div>

              <div className='flex-1 px-2 py-3.5'>
                <h5 className='mb-1'>{product.name}</h5>

                <div className='my-1 flex gap-x-2'>
                  <StarRating rating={product.rating} />
                  <span className='text-sm'>({product.reviewsCount})</span>
                </div>

                <p className='text-[1.0625rem] text-primary/90'>
                  {product.price} EGP
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
