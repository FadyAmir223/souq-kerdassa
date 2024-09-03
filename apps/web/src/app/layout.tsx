import './globals.css'

import { Roboto } from 'next/font/google'
import type { PropsWithChildren } from 'react'

import { Toaster } from '@/components/ui/toaster'
import { env } from '@/lib/env'
import { AppStoreProvider } from '@/providers/app-store-provider'
import { TRPCReactProvider } from '@/trpc/react'
import { cn } from '@/utils/cn'

// TODO: arabic font
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='ar' dir='rtl'>
      <body
        className={cn(
          roboto.className,
          // TODO: remove color
          'flex min-h-screen flex-col overflow-x-hidden bg-neutral-200',
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
