import { Text, TextInput, View } from 'react-native'

import { useUser } from '@/utils/auth/auth'

export default function CheckoutUserInfo() {
  const { user } = useUser()

  return (
    <View className='mb-6 mt-10'>
      <Text className='mb-2 text-2xl font-bold'>معلومات التواصل</Text>
      <View className='gap-y-4'>
        <View>
          <Text className='mb-1 text-xl font-bold'>الإسم</Text>
          <TextInput
            id='name'
            value={user?.name ?? ''}
            readOnly
            className='mb-1 w-full rounded-md border border-black px-4 py-1.5 text-right text-2xl text-black'
          />
        </View>
        <View>
          <Text className='mb-1 text-xl font-bold'>رقم التليفون</Text>
          <TextInput
            id='phone'
            value={user?.phone ?? ''}
            readOnly
            className='mb-1 w-full rounded-md border border-black px-4 py-1.5 text-right text-2xl text-black'
          />
        </View>
      </View>
    </View>
  )
}
