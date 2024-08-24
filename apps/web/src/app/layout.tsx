import './globals.css'

import { Roboto } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { env } from '@/lib/env'
import { AppStoreProvider } from '@/providers/counter-store-provider'
import { TRPCReactProvider } from '@/trpc/react'
import { cn } from '@/utils/cn'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          roboto.className,
          'flex min-h-screen flex-col overflow-x-hidden',
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
