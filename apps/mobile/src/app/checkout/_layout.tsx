import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

import { api } from '@/utils/api'
import { useUser } from '@/utils/auth/auth'
import { SEARCH_PARAMS } from '@/utils/constants'

const CheckoutScreenLayout = () => {
  const { user, isFetching } = useUser()
  const { data: addresses, isLoading } = api.user.addresses.all.useQuery(undefined, {
    gcTime: Infinity,
  })

  if (isFetching || isLoading)
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' />
      </View>
    )

  if (!user)
    return <Redirect href={`/login?${SEARCH_PARAMS.redirectTo}=/checkout`} />

  if (addresses?.length === 0)
    return (
      <Redirect
        href={`/(account)/addresses?${SEARCH_PARAMS.redirectTo}=/checkout`}
      />
    )

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