import { isWithinInterval } from 'date-fns'
import { Text, View } from 'react-native'

import ProductMiniList from '../product/product-mini-list'

function getSeason() {
  const today = new Date()
  const summerStart = new Date(today.getFullYear(), 3, 1) // April 1st
  const summerEnd = new Date(today.getFullYear(), 8, 30) // September 30th

  return isWithinInterval(today, { start: summerStart, end: summerEnd })
    ? 'summer'
    : 'winter'
}

export default function SimilarProducts() {
  const season = getSeason()

  return (
    <View className='pt-14'>
      <Text className='mb-3 text-3xl font-bold'>قد تعجبك</Text>

      {/* TODO: real relevance */}
      {/* @ts-expect-error page & limit has default */}
      <ProductMiniList filter={{ season }} />
    </View>
  )
}
