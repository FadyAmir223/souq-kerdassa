'use client'

import type { Order } from '@repo/db/types'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import Link from 'next/link'
import { IoMdColorFilter } from 'react-icons/io'

import ImageApi from '@/components/image'
import { Badge } from '@/components/ui/badge'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'
import { AR, PAGES } from '@/utils/constants'
import { invertColor } from '@/utils/invert-color'

import CancelOrderButton from './cancel-order-button'

export default function Orders() {
  const [orders] = api.order.all.useSuspenseQuery(undefined, {
    staleTime: Infinity,
  })

  if (orders.length === 0)
    return <h3 className='mt-6 text-center text-lg font-semibold'>لا يوجد طلبات</h3>

  return orders.map((order, orderIndex) => {
    const status = order.status as Order['status']

    const shippingCost = order.address.city.cityCategoryPrice?.price ?? 0

    const totalPrice = order.totalPrice + shippingCost

    return (
      <li key={order.id} className='rounded-md bg-white p-4 shadow-md'>
        <div className='mb-4 flex justify-between border-b border-b-gray-400 pb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center'>
            <span className='font-semibold'>وقت الطلب</span>
            <span className='inline-block text-sm text-black/80 sm:ms-3'>
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
                  'before:bg-orange-500': status === 'refunded',
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
                      className='object-cover'
                      priority={orderIndex === 0 && itemIndex < 3}
                    />
                  </div>
                </Link>

                <div>
                  <span className='font-semibold'>{item.name}</span>
                  <div className='flex flex-col items-start gap-y-1'>
                    <Badge className='inline-block'>{AR.season[item.season]}</Badge>
                    <Badge className='inline-block bg-sky-500 hover:bg-sky-500/80'>
                      {AR.category[item.category]}
                    </Badge>
                    <div className='flex gap-x-2'>
                      <Badge className='bg-indigo-500 hover:bg-indigo-500/80'>
                        الحجم {item.size}
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: item.color,
                        }}
                        className=''
                      >
                        <IoMdColorFilter
                          className='text-[14px]'
                          color={invertColor(item.color)}
                        />
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className='w-fit text-[0.9375rem] sm:w-auto'>
                <p>
                  <span className='font-semibold'>الكمية: </span>
                  {item.quantity}
                </p>
                <p>
                  <span className='font-semibold'>السعر: </span>
                  {item.price}
                </p>
                {item.discount && (
                  <p>
                    <span className='font-semibold'>بعد الخصم: </span>
                    {item.discount}
                  </p>
                )}
                <p className='mt-1 border-t border-t-gray-400 pt-1'>
                  <span className='font-semibold'>السعر الكلى: </span>
                  {item.discount ?? item.price * item.quantity}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className='mt-4 flex justify-between border-t border-t-gray-400 pt-4'>
          {status === 'pending' && <CancelOrderButton orderId={order.id} />}

          <div className='ms-auto flex flex-col'>
            <span className='text-sm font-semibold'>الشحن: {shippingCost} جنية</span>
            <span className='text-sm font-semibold text-primary'>
              المجموع: {totalPrice} جنية
            </span>
          </div>

          {/* TODO: arrival address ui ? */}
        </div>
      </li>
    )
  })
}
