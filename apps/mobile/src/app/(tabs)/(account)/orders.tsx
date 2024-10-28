import { Platform, ScrollView, StatusBar, View } from 'react-native'

import { Orders } from '@/components/orders/orders'
import ResetCheckout from '@/components/orders/reset-checkout'

export default function ProfileScreen() {
  return (
    <ScrollView
      className='mx-6 pb-2 pt-6'
      style={Platform.select({
        android: {
          marginTop: StatusBar.currentHeight,
        },
      })}
    >
      <View className='gap-y-4'>
        <Orders />
      </View>

      <ResetCheckout />
    </ScrollView>
  )
}
