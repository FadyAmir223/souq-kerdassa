'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { IoMdColorFilter } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useShallow } from 'zustand/react/shallow'

import ImageApi from '@/components/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/providers/app-store-provider'
import { cn } from '@/utils/cn'
import { AR, PAGES, SIZES } from '@/utils/constants'
import { invertColor } from '@/utils/invert-color'

import CartItemSkeleton from './cart-item-skeleton'

export default function CartItems() {
  const { cart, incrementCartItem, decrementCartItem, deleteCartItem } = useAppStore(
    useShallow(({ cart, incrementCartItem, decrementCartItem, deleteCartItem }) => ({
      cart,
      incrementCartItem,
      decrementCartItem,
      deleteCartItem,
    })),
  )

  const [isHydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)

    for (const item of cart)
      if (item.quantity === 0)
        deleteCartItem({
          itemVariantId: item.variantId,
          itemSize: item.size,
          itemColor: item.color,
        })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isHydrated)
    return (
      <div className='space-y-3'>
        <CartItemSkeleton />
        <CartItemSkeleton />
      </div>
    )

  if (cart.length === 0)
    return (
      <div className='text-center'>
        <p className='mb-16 text-2xl font-bold'>لا يوجد منتجات</p>
        <Button asChild variant='outline'>
          <Link href={PAGES.public.main}>املأ عربة التسوق</Link>
        </Button>
      </div>
    )

  return (
    <>
      <ul className='space-y-3'>
        {cart.map((item) => (
          <li
            key={item.id + item.season + item.category + item.size + item.color}
            className='flex flex-col gap-y-2 rounded-md bg-white p-3 sm:flex-row sm:items-center sm:justify-between'
          >
            <div className='flex gap-x-5'>
              <Link href={PAGES.public.product(item.id)}>
                <div className='relative aspect-[83/100] w-24 overflow-hidden rounded-md'>
                  <ImageApi
                    src={item.image}
                    alt={item.name}
                    fill
                    // may pass index to preload only first 3
                    priority
                    sizes='6rem'
                    className='object-cover'
                  />
                </div>
              </Link>

              <div className='self-center'>
                <span className='mb-2.5 block text-lg font-semibold'>
                  {item.name}
                </span>
                <div className='flex flex-col items-start gap-y-1'>
                  <Badge className='inline-block'>{AR.season[item.season]}</Badge>
                  <Badge className='inline-block bg-sky-500 hover:bg-sky-500/80'>
                    {AR.category[item.category]}
                  </Badge>
                  <div className='flex gap-x-2'>
                    <Badge className='bg-indigo-500 hover:bg-indigo-500/80'>
                      {SIZES[item.size]}
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: item.color,
                      }}
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

            <span className='text-lg font-semibold text-primary'>
              {item.price} جنية
            </span>

            <div className='flex w-fit gap-x-4 border-2 border-gray-400 p-0.5'>
              <Button
                variant='none'
                size='none'
                className='grid size-5 place-items-center text-gray-400'
                onClick={() =>
                  incrementCartItem({
                    itemVariantId: item.variantId,
                    itemSize: item.size,
                    itemColor: item.color,
                  })
                }
                aria-label={`زيادة كمية ${item.name}`}
              >
                <FaPlus />
              </Button>

              <span className='text-sm text-gray-600'>{item.quantity}</span>

              <Button
                variant='none'
                size='none'
                className='grid size-5 place-items-center text-gray-400'
                onClick={() =>
                  decrementCartItem({
                    itemVariantId: item.variantId,
                    itemSize: item.size,
                    itemColor: item.color,
                  })
                }
                aria-label={`تقليل كمية ${item.name}`}
              >
                <FaMinus />
              </Button>
            </div>

            <Button
              variant='none'
              size='icon'
              className='text-destructive'
              onClick={() =>
                deleteCartItem({
                  itemVariantId: item.variantId,
                  itemSize: item.size,
                  itemColor: item.color,
                })
              }
              aria-label={`إزالة ${item.name} من السلة`}
            >
              <IoClose size={30} />
            </Button>
          </li>
        ))}
      </ul>

      <div className='mt-7 flex flex-col justify-between gap-y-4 sm:flex-row'>
        {[
          {
            label: 'مواصلة التسوق',
            url: PAGES.public.main,
            icon: MdOutlineKeyboardDoubleArrowRight,
          },
          {
            label: 'الدفع',
            url: PAGES.protected.buy.checkout,
            icon: MdOutlineKeyboardDoubleArrowLeft,
          },
        ].map(({ label, url, icon: Icon }, idx) => (
          <Button
            key={label}
            asChild
            variant={idx === 0 ? 'outline' : undefined}
            className='flex min-w-44 items-center justify-between py-5 text-lg'
          >
            <Link href={url}>
              <span className={cn(idx === 0 && 'order-1')}>{label}</span>
              <Icon size={22} />
            </Link>
          </Button>
        ))}
      </div>
    </>
  )
}
