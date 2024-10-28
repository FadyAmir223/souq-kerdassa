import { View } from 'react-native'

export default function CartItemSkeleton() {
  return (
    <View className='gap-y-2 rounded-md bg-white p-3'>
      <View className='flex-row gap-x-5'>
        <View className='aspect-[83/100] w-32 rounded-md bg-neutral-500/50' />

        <View className='self-center'>
          <View className='mb-3 h-7 w-36 rounded-md bg-neutral-500/50' />
          <View className='max-w-[5.5rem] gap-y-2.5'>
            <View className='h-7 w-[5.5rem] rounded-md bg-neutral-500/50' />
            <View className='h-7 w-[5.5rem] rounded-md bg-neutral-500/50' />
          </View>
        </View>
      </View>

      <View className='mt-0.5 h-7 w-24 rounded-md bg-neutral-500/50' />

      <View className='flex-row items-center gap-x-7'>
        <View className='h-12 w-32 rounded-md bg-neutral-500/50' />

        <View className='size-9 rounded-md bg-neutral-500/50' />
      </View>
    </View>
  )
}
