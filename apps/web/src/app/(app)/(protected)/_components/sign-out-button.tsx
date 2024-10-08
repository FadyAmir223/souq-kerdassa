'use client'

import { signOut } from 'next-auth/react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { PAGES } from '@/utils/constants'

export default function SignOutButton() {
  const { pending } = useFormStatus()
  const utils = api.useUtils()

  return (
    <Button
      variant='none'
      size='none'
      className='block w-full rounded-md bg-destructive px-3 py-1 text-start text-lg transition-[transform,colors] hover:bg-destructive/90 active:scale-[0.99]'
      formAction={async () => {
        await signOut({ callbackUrl: PAGES.public.main })
        await utils.invalidate()
      }}
      disabled={pending}
    >
      تسجيل الخروج
    </Button>
  )
}
