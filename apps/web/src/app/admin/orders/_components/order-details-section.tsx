'use client'

import type { Order } from '@repo/db/types'
import type { AdminOrderStatusSchema } from '@repo/validators'
import { keepPreviousData } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

import ImageApi from '@/components/image'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'

import { orderFilterOptions } from '../_utils/order-filter-opts'

type OrderDetailsSectionProps = {
  orderId: Order['id'] | null
}

export default function OrderDetailsSection({ orderId }: OrderDetailsSectionProps) {
  const { data: orderDetails, isFetching } = api.order.admin.detailsById.useQuery(
    orderId!,
    {
      gcTime: Infinity,
      enabled: !!orderId,
      placeholderData: keepPreviousData,
    },
  )

  if (!orderId) return null

  if (!orderDetails) {
    if (isFetching) return null
    return <h3 className='mt-3 text-center font-semibold'>الطلب غير موجود</h3>
  }

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <div className='grid gap-0.5'>
          <CardTitle className='group flex items-center gap-2 text-lg'>
            الطلب
          </CardTitle>
          {orderDetails.createdAt && (
            <CardDescription>
              التاريخ:{' '}
              {format(orderDetails.createdAt, 'MMMM d, yyyy', { locale: ar })}
            </CardDescription>
          )}
        </div>
        <div className='ms-auto'>
          <Badge
            variant='secondary'
            className={cn('text-xs before:me-1 before:size-2 before:rounded-full', {
              'text-yellow-500 before:bg-yellow-500':
                orderDetails.status === 'pending',
              'text-green-500 before:bg-green-500':
                orderDetails.status === 'completed',
              'text-gray-500 before:bg-gray-500':
                orderDetails.status === 'cancelled',
              'text-orange-500 before:bg-orange-500':
                orderDetails.status === 'refunded',
            })}
          >
            {orderFilterOptions[orderDetails.status as AdminOrderStatusSchema]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-6 text-sm'>
        <div className='grid gap-3'>
          <div className='font-semibold'>تفاصيل الطلب</div>
          <ul className='grid gap-3'>
            {orderDetails.products?.map((product) => (
              <li key={product.id} className='flex items-center justify-between'>
                <div className='relative aspect-[83/100] w-12'>
                  <ImageApi
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes='3rem'
                  />
                </div>
                <span className='text-muted-foreground'>
                  {product.name} x <span>{product.quantity}</span>
                </span>
                <span>{product.price}</span>
              </li>
            ))}
          </ul>

          <Separator className='my-2' />

          <ul className='grid gap-3'>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>قبل الشحن</span>
              <span>{orderDetails.totalPrice}</span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-muted-foreground'>الشحن</span>
              <span>{orderDetails.shipping}</span>
            </li>
            <li className='flex items-center justify-between font-semibold'>
              <span className='text-muted-foreground'>الاجمالى</span>
              <span>{orderDetails.totalPrice + orderDetails.shipping}</span>
            </li>
          </ul>
        </div>

        <Separator className='my-4' />

        <div className='grid gap-3'>
          <div className='font-semibold'>معلومات الشحن</div>
          <address className='grid gap-0.5 not-italic'>
            <div className='flex'>
              <dt className='min-w-[4.5rem] text-muted-foreground'>المدينة</dt>
              <dd>{orderDetails.address.city}</dd>
            </div>
            <div className='flex'>
              <dt className='min-w-[4.5rem] text-muted-foreground'>المنطقة</dt>
              <dd>{orderDetails.address.region}</dd>
            </div>
            <div className='flex'>
              <dt className='min-w-[4.5rem] text-muted-foreground'>الشارع</dt>
              <dd>{orderDetails.address.street}</dd>
            </div>
            <div className='flex'>
              <dt className='min-w-[4.5rem] text-muted-foreground'>المبنى</dt>
              <dd>{orderDetails.address.building}</dd>
            </div>
            <div className='flex'>
              <dt className='min-w-[4.5rem] text-muted-foreground'>علامة مميزة</dt>
              <dd>{orderDetails.address.mark ?? 'لا يوجد'}</dd>
            </div>
          </address>
        </div>

        <Separator className='my-4' />

        <div className='grid gap-3'>
          <div className='font-semibold'>معلومات العميل</div>
          <dl className='grid gap-3'>
            <div className='flex items-center justify-between'>
              <dt className='text-muted-foreground'>العميل</dt>
              <dd>{orderDetails.user?.name}</dd>
            </div>
            <div className='flex items-center justify-between'>
              <dt className='text-muted-foreground'>التليفون</dt>
              <dd>
                <a href='tel:'>{orderDetails.user?.name}</a>
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  )
}
