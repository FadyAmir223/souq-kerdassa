import type { Metadata } from 'next'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'

import AdminLoginForm from './_components/admin-login-form'

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'تسجيل الدخول للأدمن',
}

export default function AdminLoginPage() {
  return (
    <main className='grid flex-1 place-items-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>تسجيل الدخول</CardTitle>
        </CardHeader>
        <AdminLoginForm />
      </Card>
    </main>
  )
}
