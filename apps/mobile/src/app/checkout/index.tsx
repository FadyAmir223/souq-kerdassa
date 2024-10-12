import { useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import CheckoutAddressSelection from '@/components/checkout/checkout-address-selection'
import CheckoutItemsSection from '@/components/checkout/checkout-items-section'
import CheckoutUserInfo from '@/components/checkout/checkout-user-info'

export default function CheckoutScreen() {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'الشراء',
    })
  }, [navigation])

  return (
    <SafeAreaView>
      <ScrollView className='px-6 pb-2'>
        <CheckoutItemsSection />
        <CheckoutUserInfo />
        <CheckoutAddressSelection />
      </ScrollView>
    </SafeAreaView>
  )
}
