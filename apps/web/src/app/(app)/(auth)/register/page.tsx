import type { Metadata } from 'next'

import H1 from '@/components/h1'
import LinkWithParams from '@/components/link-with-params'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/utils/constants'

import RegisterForm from './_components/register-form'

export const metadata: Metadata = {
  title: 'إنشاء حساب',
  description:
    'أنشئى حسابك في سوق كرداسة لبدء التسوق. سجلى الآن واستمتعى بأحدث التصاميم والموديلات.',
}

export default function RegisterPage() {
  return (
    <main className='container max-w-xl'>
      <H1>إنشاء حساب</H1>
      <RegisterForm />

      <div className='mt-6 space-x-3 text-sm'>
        <span className='font-semibold'>لديك حساب بالفعل؟</span>
        <Button variant='link'>
          <LinkWithParams href={{ pathname: PAGES.auth.login }}>
            تسجيل الدخول
          </LinkWithParams>
        </Button>
      </div>
    </main>
  )
}
