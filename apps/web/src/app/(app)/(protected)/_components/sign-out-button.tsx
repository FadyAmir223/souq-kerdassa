'use client'

import { signOut } from 'next-auth/react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/utils/constants'

export default function SignOutButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      variant='none'
      size='none'
      className='block w-full rounded-md bg-destructive px-3 py-1 text-start text-lg transition-colors hover:bg-destructive/90'
      formAction={async () => {
        // CSRF issue but it works
        // maybe because of misconfiguration or
        // using session instead of jwt for credentials
        await signOut({ callbackUrl: PAGES.public.main })
      }}
      disabled={pending}
    >
      تسجيل الخروج
    </Button>
  )
}
