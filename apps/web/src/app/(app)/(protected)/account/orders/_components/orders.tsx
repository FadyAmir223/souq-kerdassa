'use client'

import type { Category, Order, Season } from '@repo/db/types'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import Link from 'next/link'

import ImageApi from '@/components/image'
import { Badge } from '@/components/ui/badge'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'
import { AR, PAGES, shippingCost } from '@/utils/constants'

import CancelOrderButton from './cancel-order-button'

export default function Orders() {
  const [orders] = api.order.all.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  })

  if (orders.length === 0)
    return <h3 className='mt-6 text-center text-lg font-semibold'>لا يوجد طلبات</h3>

  return orders.map((order, orderIndex) => {
    const status = order.status as Order['status']

    const totalPrice =
      order.products.reduce(
        (acc, { price, quantity }) => acc + price * quantity,
        0,
      ) + shippingCost

    return (
      <li key={order.id} className='rounded-md bg-white p-4 shadow-md'>
        <div className='mb-4 flex justify-between border-b border-b-gray-400 pb-4'>
          <div className=''>
            <span className='font-semibold'>وقت الطلب</span>
            <span className='ms-3 inline-block text-sm text-black/80'>
              {formatDistanceToNow(order.createdAt, {
                addSuffix: true,
                locale: ar,
              })}
            </span>
          </div>

          <div className='flex items-center gap-x-1'>
            <span className='text-sm font-semibold'>{AR.status[status]}</span>
            <div
              className={cn(
                'grid size-6 place-items-center before:size-2 before:rounded-full',
                {
                  'before:bg-yellow-500': status === 'pending',
                  'before:bg-green-500': status === 'completed',
                  'before:bg-gray-500': status === 'cancelled',
                },
              )}
            />
          </div>
        </div>

        <ul>
          {order.products.map((item, itemIndex) => (
            <li
              key={item.id}
              className='flex flex-col justify-between gap-y-4 sm:flex-row sm:items-center sm:gap-y-0 sm:px-4 [&:not(:last-child)]:mb-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-b-gray-400 [&:not(:last-child)]:pb-4'
            >
              <div className='flex items-center gap-x-4'>
                <Link href={PAGES.public.product(item.productId)}>
                  <div className='relative aspect-[83/100] w-20 overflow-hidden rounded-md'>
                    <ImageApi
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes='5rem'
                      priority={orderIndex === 0 && itemIndex < 3}
                    />
                  </div>
                </Link>

                <div className=''>
                  <p className=''>{item.name}</p>
                  <div className='mb-1'>
                    <Badge>{AR.season[item.season as Season]}</Badge>
                  </div>
                  <div className=''>
                    <Badge className='bg-sky-500 hover:bg-sky-500/80'>
                      {AR.category[item.category as Category]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='w-fit sm:w-auto'>
                <p className=''>
                  <span className='font-semibold'>الكمية: </span>
                  {item.quantity}
                </p>
                <p className=''>
                  <span className='font-semibold'>السعر: </span>
                  {item.price}
                </p>
                <p className='mt-1 border-t border-t-gray-400 pt-1'>
                  <span className='font-semibold'>السعر الكلى: </span>
                  {item.price * item.quantity}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className='mt-4 flex justify-between border-t border-t-gray-400 pt-4'>
          {status === 'pending' && <CancelOrderButton orderId={order.id} />}

          <span className='ms-auto font-semibold text-primary'>
            {totalPrice} جنية
          </span>

          {/* TODO: arrival address ui ? */}
          {/* TODO: tax ui ? */}
        </div>
      </li>
    )
  })
}
