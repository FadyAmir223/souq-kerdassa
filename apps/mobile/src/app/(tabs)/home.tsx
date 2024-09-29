import { Text, View } from 'react-native'

// import ProductCard from '@/components/product/product-card'
import { api } from '@/utils/api'

export default function HomeScreen() {
  const { data: products } = api.product.byFilter.useQuery({
    page: 1,
    limit: 10,
    type: 'latest',
  })

  if (!products)
    return (
      <View>
        <Text>loadng...</Text>
      </View>
    )

  return (
    <View>
      <Text>hello</Text>
    </View>
  )
}
