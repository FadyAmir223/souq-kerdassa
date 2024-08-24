import '@bacons/text-decoder/install'
import '../styles.css'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { TRPCProvider } from '@/utils/api'

export default function RootLayout() {
  return (
    <TRPCProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f472b6',
          },
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      />
      <StatusBar />
    </TRPCProvider>
  )
}
