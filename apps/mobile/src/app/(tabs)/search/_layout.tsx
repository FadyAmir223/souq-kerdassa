import { Stack } from 'expo-router'

const SongsScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerTitle: '' }} />
    </Stack>
  )
}

export default SongsScreenLayout
