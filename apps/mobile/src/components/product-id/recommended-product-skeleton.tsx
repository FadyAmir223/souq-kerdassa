import { View } from 'react-native'

export default function RecommendedProductSkeleton() {
  return (
    <View className='h-36 animate-pulse flex-row justify-between gap-x-2 rounded-md bg-white p-2'>
      <View className='aspect-[83/100] rounded-md bg-neutral-500/50' />

      <View className='flex-1 px-2 py-3.5'>
        <View className='h-5 w-32 rounded-md bg-neutral-500/50' />
        <View className='my-3.5 h-5 w-36 rounded-md bg-neutral-500/50' />
        <View className='h-5 w-24 rounded-md bg-neutral-500/50' />
      </View>
    </View>
  )
}
