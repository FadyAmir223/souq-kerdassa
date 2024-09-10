import type { Metadata } from 'next'

import H1 from '@/components/h1'

import EditProfileForm from './_components/edit-profile-form'

export const metadata: Metadata = {
  title: 'معلومات الحساب',
  description:
    'قومى بتحديث معلوماتك الشخصية. يمكنك تغيير اسمك أو رقم هاتفك لتبقى معلوماتك محدثة.',
}

export default function ProfilePage() {
  return (
    <main className='flex-1'>
      <H1>معلومات الحساب</H1>

      <section className='rounded-md bg-white px-5 py-8 shadow-md'>
        <EditProfileForm />
      </section>
    </main>
  )
}
