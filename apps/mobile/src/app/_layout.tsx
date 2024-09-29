import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { TRPCProvider } from '@/utils/api'

export default function RootLayout() {
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>

        <StatusBar style='auto' />
      </SafeAreaProvider>
    </TRPCProvider>
  )
}
