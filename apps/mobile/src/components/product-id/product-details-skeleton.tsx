import { View } from 'react-native'

export default function ProductDetailsSkeleton() {
  return (
    <View className='animate-pulse'>
      <View className='mb-5 aspect-[83/100] w-full rounded-md bg-neutral-500/50' />

      <View className='flex-[0.25] flex-row gap-x-3.5'>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className='aspect-[83/100] flex-1 rounded-md bg-neutral-500/50'
          />
        ))}
      </View>

      {/* animate-pulse */}
      <View className='mt-8 flex-1'>
        <View className='mb-5 h-6 w-36 rounded-md bg-neutral-500/50' />
        <View className='mb-4 h-7 w-44 rounded-md bg-neutral-500/50' />
        <View className='mb-7 h-7 w-28 rounded-md bg-neutral-500/50' />

        <View>
          {[1, 2].map((i) => (
            <View key={i} className='mb-5 flex-row items-center gap-x-6'>
              <View className='h-6 w-20 rounded-md bg-neutral-500/50' />
              <View className='flex-row gap-x-2'>
                <View className='h-8 w-20 rounded-md bg-neutral-500/50' />
                <View className='h-8 w-20 rounded-md bg-neutral-500/50' />
              </View>
            </View>
          ))}

          <View className='mt-5 h-10 w-40 rounded-md bg-neutral-500/50' />
        </View>

        <View className='mt-8'>
          <View className='mb-4 mt-10 h-8 w-24 rounded-md bg-neutral-500/50' />

          <View className='mb-2 h-5 w-full rounded-md bg-neutral-500/50' />
          <View className='mb-2 h-5 w-full rounded-md bg-neutral-500/50' />
          <View className='h-5 w-1/3 rounded-md bg-neutral-500/50' />
        </View>
      </View>
    </View>
  )
}
