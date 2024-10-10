import { Link, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import { api } from '@/utils/api'

export default function RedirectToCheckoutButton() {
  const { data: addresses } = api.user.addresses.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  const searchParams = useLocalSearchParams<{ redirectTo?: string }>()

  if (searchParams.redirectTo !== '' || addresses?.length === 0) return null

  return (
    <View className='mt-8'>
      <Link
        href='/checkout'
        className='mx-auto rounded-md bg-primary px-4 py-2 text-2xl text-white'
      >
        اكمل الشراء
      </Link>
    </View>
  )
}
