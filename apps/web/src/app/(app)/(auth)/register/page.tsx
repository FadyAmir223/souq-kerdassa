import H1 from '@/components/h1'

import RegisterForm from './_components/register-form'

export default function RegisterPage() {
  return (
    <main className='container max-w-xl'>
      <H1>إنشاء حساب</H1>
      <RegisterForm />
    </main>
  )
}
