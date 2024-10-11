import { Platform, ScrollView, StatusBar, View } from 'react-native'

import { Orders } from '@/components/orders/orders'

export default function ProfileScreen() {
  return (
    <ScrollView
      className='mb-[4.25rem] px-4'
      style={Platform.select({
        android: {
          marginTop: StatusBar.currentHeight,
        },
      })}
    >
      <View className='gap-y-4'>
        <Orders />
      </View>
    </ScrollView>
  )
}
