import H1 from '@/components/h1'
import LinkWithParams from '@/components/link-with-params'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/utils/constants'

import LoginForm from './_components/login-form'

export default function LoginPage() {
  return (
    <main className='container max-w-xl'>
      <H1>تسجيل الدخول</H1>
      <LoginForm />

      <div className='mt-6 space-x-3 text-sm'>
        <span className='font-semibold'>ليس لديك حساب؟</span>
        <Button variant='link'>
          <LinkWithParams href={{ pathname: PAGES.auth.register }}>
            إنشاء حساب
          </LinkWithParams>
        </Button>
      </div>
    </main>
  )
}
