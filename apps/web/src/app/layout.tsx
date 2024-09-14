import './globals.css'

import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import type { PropsWithChildren } from 'react'

import { Toaster } from '@/components/ui/toaster'
import { env } from '@/lib/env'
import { AppStoreProvider } from '@/providers/app-store-provider'
import { TRPCReactProvider } from '@/trpc/react'
import { cn } from '@/utils/cn'

const meta = {
  title: 'سوق كرداسة',
}

export const metadata: Metadata = {
  title: {
    default: meta.title,
    template: `%s | ${meta.title}`,
  },
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/ico',
        url: '/favicon/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/favicon/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/favicon/android-chrome-512x512.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/favicon/apple-touch-icon.png',
      },
    ],
  },
}

const roboto = Rubik({
  weight: ['400', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='ar' dir='rtl'>
      <body
        className={cn(
          roboto.className,
          'flex min-h-dvh flex-col overflow-x-hidden bg-neutral-200',
          env.NODE_ENV === 'development' && 'debug-screens',
        )}
      >
        <TRPCReactProvider>
          <AppStoreProvider>{children}</AppStoreProvider>
        </TRPCReactProvider>

        <Toaster />
      </body>
    </html>
  )
}
