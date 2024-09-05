import H1 from '@/components/h1'

import EditProfileForm from './_components/edit-profile-form'

export default function ProfilePage() {
  return (
    <main className='w-full'>
      <H1>معلومات الحساب</H1>

      <section className='rounded-md bg-white px-5 py-8 shadow-md'>
        <EditProfileForm />
      </section>
    </main>
  )
}
