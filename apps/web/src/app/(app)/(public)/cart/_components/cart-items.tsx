'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useShallow } from 'zustand/react/shallow'

import ImageApi from '@/components/image'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/providers/app-store-provider'
import { AR } from '@/utils/constants'

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
  }, [])

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
          <Link href='/'>املأ سلة المشتريات</Link>
        </Button>
      </div>
    )

  return (
    <ul className='space-y-3'>
      {cart.map((item) => (
        <li
          key={item.id}
          className='flex items-center justify-between rounded-md bg-white p-3'
        >
          <div className='flex gap-x-5'>
            <div className='relative aspect-[83/100] w-24'>
              <ImageApi
                src={item.image}
                alt={item.name}
                fill
                priority
                sizes='6rem'
                className='object-cover'
              />
            </div>

            <div className='self-center'>
              <h5 className='mb-2.5 text-lg font-semibold'>{item.name}</h5>
              <div className='space-x-5'>
                <p className=''>{AR.season[item.season]}</p>
                <p className=''>{AR.category[item.category]}</p>
              </div>
            </div>
          </div>

          <span className='text-lg font-semibold text-primary'>
            {item.price} EGP
          </span>

          <div className='flex gap-x-4 border-2 border-gray-400 p-0.5'>
            <Button
              variant='none'
              size='none'
              className='grid size-5 place-items-center text-gray-400'
              onClick={() => {
                incrementCartItem({
                  id: item.id,
                  category: item.category,
                  season: item.season,
                })
              }}
            >
              <FaPlus />
            </Button>

            <span className='text-sm text-gray-600'>{item.quantity}</span>

            <Button
              variant='none'
              size='none'
              className='grid size-5 place-items-center text-gray-400'
              onClick={() => {
                decrementCartItem({
                  id: item.id,
                  category: item.category,
                  season: item.season,
                })
              }}
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
                id: item.id,
                category: item.category,
                season: item.season,
              })
            }
          >
            <IoClose size={30} />
          </Button>
        </li>
      ))}
    </ul>
  )
}
