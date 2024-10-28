import { View } from 'react-native'

export default function ProductCardSkeleton() {
  return (
    <View className='overflow-hidden rounded-lg'>
      <View className='aspect-[83/100] bg-neutral-500/50' />

      <View className='bg-white p-3'>
        <View className='mx-auto h-6 w-2/3 rounded-md bg-neutral-500/50' />
        <View className='my-3 flex-row justify-center gap-x-1'>
          <View className='h-5 w-7 rounded-md bg-neutral-500/50' />
          <View className='h-5 w-24 rounded-md bg-neutral-500/50' />
        </View>

        <View className='mx-auto h-6 w-1/2 rounded-md bg-neutral-500/50' />
      </View>
    </View>
  )
}
