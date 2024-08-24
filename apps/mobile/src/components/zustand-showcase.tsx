import { useCombinedStore } from '@repo/store/mobile'
import { Button, Text, View } from 'react-native'

export default function ZustandShowcase() {
  const count = useCombinedStore((s) => s.count)
  const increment = useCombinedStore((s) => s.increment)

  return (
    <View>
      <Text className='text-black'>{count}</Text>
      <Button title='Increment' onPress={() => increment(1)} />
    </View>
  )
}
