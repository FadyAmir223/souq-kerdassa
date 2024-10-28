import { View } from 'react-native'

export default function OrderSkeleton() {
  return (
    <View className='rounded-md bg-white p-4'>
      <View className='mb-4 flex-row justify-between border-b border-b-gray-400 pb-4'>
        <View>
          <View className='mb-1 h-6 w-24 rounded-md bg-neutral-500/50' />
          <View className='h-5 w-28 rounded-md bg-neutral-500/50' />
        </View>

        <View className='flex-row items-center gap-x-1'>
          <View className='h-5 w-14 rounded-md bg-neutral-500/50' />

          <View className='size-6 items-center justify-center'>
            <View className='size-2 rounded-full bg-neutral-500/50' />
          </View>
        </View>
      </View>

      <View>
        {[1, 2].map((i) => (
          <View
            key={i}
            className='mb-4 justify-between gap-y-4 border-b border-b-gray-400 pb-4'
          >
            <View className='flex-row items-center gap-x-4'>
              <View className='aspect-[83/100] w-32 rounded-md bg-neutral-500/50' />

              <View>
                <View className='mb-2 h-6 w-28 rounded-md bg-neutral-500/50' />
                <View className='mb-1.5 h-7 w-20 rounded-md bg-neutral-500/50' />
                <View className='h-8 w-20 rounded-md bg-neutral-500/50' />
              </View>
            </View>

            <View className='h-[6.25rem] w-36 rounded-md bg-neutral-500/50' />
          </View>
        ))}
      </View>

      <View className='flex-row items-center justify-between'>
        <View className='h-7 w-28 rounded-md bg-neutral-500/50' />

        <View>
          <View className='mb-1 h-6 w-32 rounded-md bg-neutral-500/50' />
          <View className='h-6 w-36 rounded-md bg-neutral-500/50' />
        </View>
      </View>
    </View>
  )
}
