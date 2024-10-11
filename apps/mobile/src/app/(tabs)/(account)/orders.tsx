import { Platform, ScrollView, StatusBar, View } from 'react-native'

import { Orders } from '@/components/orders/orders'

export default function ProfileScreen() {
  return (
    <ScrollView
      className='px-4 pb-2'
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
