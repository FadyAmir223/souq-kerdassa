import { Redirect, Stack } from 'expo-router'

import { api } from '@/utils/api'

export default function TabsAccountNavigation() {
  const { data: session, isLoading } = api.auth.getSession.useQuery()

  if (isLoading) return null
  if (!session?.user) return <Redirect href='/login' />

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='addresses' options={{ headerShown: false }} />
      <Stack.Screen name='orders' options={{ headerShown: false }} />
    </Stack>
  )
}
