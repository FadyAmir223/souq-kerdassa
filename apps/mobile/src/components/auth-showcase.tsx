import { Button, Text, View } from 'react-native'

import { useSignIn, useSignOut, useUser } from '@/utils/auth'

export default function AuthShowcase() {
  const user = useUser()
  const signIn = useSignIn()
  const signOut = useSignOut()

  return (
    <>
      {user?.name ? (
        <View>
          <Text className='pb-2 text-center text-xl font-semibold text-black'>
            {user?.name}
          </Text>
          <Text className='pb-2 text-center text-xl font-semibold text-black'>
            {user?.email}
          </Text>
        </View>
      ) : (
        <Text>Not logged in</Text>
      )}
      <Button
        onPress={() => (user ? signOut() : signIn())}
        title={user ? 'Sign Out' : 'Sign In With Discord'}
        color={'#5B65E9'}
      />
    </>
  )
}
