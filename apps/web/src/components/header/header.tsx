import { auth } from '@repo/auth'
import Image from 'next/image'
import Link from 'next/link'
import { BsCart } from 'react-icons/bs'
import { FaRegUser } from 'react-icons/fa'

import logo from '@/public/assets/images/logo.png'
import { cn } from '@/utils/cn'

import { CartTotalPrice, CartTotalQuantity } from '../cart-info'
import SearchField from '../search-field'

export default async function Header() {
  const session = await auth()

  return (
    <header className='fixed z-40 w-full bg-white shadow-lg'>
      <div className='container flex items-center justify-between gap-x-4 py-4 md:gap-x-6 lg:gap-x-8'>
        <Link href='/'>
          <Image src={logo} alt='logo' className='w-20' priority />
        </Link>

        {/* TODO: remove search field from the header (come up with alt ui) */}
        <SearchField />

        <Link href='/account' className={cn({ 'flex gap-x-3': session?.user })}>
          <div className='grid size-10 place-items-center rounded-full bg-[#e4e6ed]'>
            <FaRegUser className='size-5 md:size-[1.375rem]' />
          </div>

          {session?.user && (
            <div className='text-sm'>
              <p className='max-w-28 truncate'>اهلاً {session.user.name}</p>
              <p className=''>لوحة التحكم</p>
            </div>
          )}
        </Link>

        <Link href='/cart' className='flex gap-x-3'>
          <div className='relative grid size-10 place-items-center rounded-full bg-[#e4e6ed]'>
            <BsCart className='size-5 md:size-[1.375rem]' />
            <div className='absolute right-0 top-0 grid size-[1.125rem] translate-x-[4px] translate-y-[-4px] place-items-center rounded-full bg-black text-xs text-white'>
              <CartTotalQuantity />
            </div>
          </div>

          <div className='hidden lg:block'>
            <p className='text-xs'>عربة التسوق الخاصة بى</p>
            <p className='text-sm'>
              EGP <CartTotalPrice />
            </p>
          </div>
        </Link>
      </div>
    </header>
  )
}