import { Stack } from 'expo-router'

const SongsScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerTitle: 'البحث',
          headerLargeTitle: true,
          headerLargeStyle: {
            backgroundColor: '#00ffff',
          },
          headerLargeTitleStyle: {
            color: '#c82d2d',
          },
          headerTintColor: '#c82d2d',
          // headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  )
}

export default SongsScreenLayout
