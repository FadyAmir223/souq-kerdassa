import { View } from 'react-native'

export default function ReviewsSectionSkeleton() {
  return (
    <View className='animate-pulse'>
      <View className='mb-7'>
        <View className='mb-2.5 h-7 w-[13.5rem] rounded-md bg-neutral-500/50' />
        <View className='h-6 w-24 rounded-md bg-neutral-500/50' />
      </View>

      <View className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} className='rounded-md bg-white px-4 py-5 shadow-sm'>
            <View className='mb-3 h-6 w-64 rounded-md bg-neutral-500/50' />
            <View className='h-5 w-4/5 rounded-md bg-neutral-500/50' />
          </View>
        ))}
      </View>

      <View className='mx-auto mt-8 flex-row gap-x-4'>
        <View className='h-8 w-20 rounded-md bg-neutral-500/50' />
        <View className='h-8 w-20 rounded-md bg-neutral-500/50' />
      </View>
    </View>
  )
}
