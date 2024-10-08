import '../styles.css'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { I18nManager } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { TRPCProvider } from '@/utils/api'

I18nManager.forceRTL(true)

export default function RootLayout() {
  return (
    <>
      <TRPCProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />

            <Stack.Screen name='(auth)/login' options={{ headerShown: false }} />
            <Stack.Screen name='(auth)/register' options={{ headerShown: false }} />
          </Stack>

          <StatusBar style='auto' />
        </SafeAreaProvider>
      </TRPCProvider>

      <Toast />
    </>
  )
}
