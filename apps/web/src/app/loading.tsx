import Image from 'next/image'

import logo from '@/public/assets/images/logo.png'

export default function Loading() {
  return (
    <div className='absolute inset-0 grid place-items-center bg-white'>
      <Image src={logo} alt='logo' className='animate-scale max-w-20' sizes='5rem' />
    </div>
  )
}
