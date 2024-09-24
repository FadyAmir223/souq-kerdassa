import { auth } from '@repo/auth'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

import Footer from '@/app/(app)/_components/footer'
import Header from '@/app/(app)/_components/header'
import { env } from '@/lib/env'

const meta = {
  title: 'سوق كرداسة',
  description:
    'اكتشفى مجموعة متنوعة من العبايات العصرية في سوق كرداسة. عبايات صيفية و شتوية بجودة عالية وأسعار تنافسية. تصاميم فريدة تناسب النساء و الأطفال.',
  image: `${env.NEXT_PUBLIC_SITE_URL}/assets/images/logo.webp`,
}

export const metadata: Metadata = {
  description: meta.description,
  category: 'ملابس, عبايات, ملابس نسائية, ملابس أطفال',
  keywords: [
    'سوق كرداسة',
    'عبايات',
    'عبايات صيفية',
    'عبايات شتوية',
    'عبايات نسائية',
    'عبايات أطفال',
    'عبايات عصرية',
  ],
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: env.NEXT_PUBLIC_SITE_URL,
    locale: 'ar_EG',
    siteName: meta.title,
    type: 'website',
    images: [
      {
        url: meta.image,
        alt: `${meta.title} logo`,
        width: 624,
        height: 486,
      },
    ],
  },
  twitter: {
    title: meta.title,
    description: meta.description,
    images: meta.image,
    card: 'summary_large_image',
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
  },
  // i18n (for each page)
  // alternates: {
  //   canonical: env.NEXT_PUBLIC_SITE_URL,
  //   languages: {
  //     'ar-EG': env.NEXT_PUBLIC_SITE_URL,
  //   },
  // },
}

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <>
      <Header />
      <div className='mb-16 mt-32 min-h-[65vh]'>
        <SessionProvider session={session}>{children}</SessionProvider>
      </div>
      <Footer />
    </>
  )
}
