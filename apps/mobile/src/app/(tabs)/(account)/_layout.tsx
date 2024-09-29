import { Stack } from 'expo-router'

export default function TabsAccountNavigation() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerTitle: 'profile' }} />
      <Stack.Screen name='addresses' options={{ headerTitle: 'addresses' }} />
      <Stack.Screen name='orders' options={{ headerTitle: 'orders' }} />
    </Stack>
  )
}
