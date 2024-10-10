import { KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native'

import ActionAddressForm from '@/components/addresses/action-address-form'
import { Addresses } from '@/components/addresses/addresses'
import RedirectToCheckoutButton from '@/components/addresses/redirect-to-checkout-button'

export default function ProfileScreen() {
  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        className='px-4'
        style={Platform.select({
          android: {
            marginTop: StatusBar.currentHeight,
          },
        })}
      >
        <ActionAddressForm action='add' />
        <Addresses />
        <RedirectToCheckoutButton />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
