import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { useUser } from '@/utils/auth/auth'
import { SEARCH_PARAMS } from '@/utils/constants'

const CheckoutScreenLayout = () => {
  const { user, isLoading } = useUser()

  if (isLoading)
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='small' />
      </View>
    )

  if (!user)
    return <Redirect href={`/login?${SEARCH_PARAMS.redirectTo}=/checkout`} />

  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default CheckoutScreenLayout
