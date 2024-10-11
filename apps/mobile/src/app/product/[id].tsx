import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native'

import ImageViewer from '@/components/product-id/image-viewer'
import ProductDetails from '@/components/product-id/product-details'
import ProductDetailsSkeleton from '@/components/product-id/product-details-skeleton'
import ProductSidebar from '@/components/product-id/product-sidebar'
import ReviewsSection from '@/components/product-id/reviews/reviews-section'
import SimilarProducts from '@/components/product-id/similar-products'
import { api } from '@/utils/api'

export default function ProductByIdScreen() {
  const { id: productId } = useLocalSearchParams<{ id: string }>()

  const { data: product, isLoading } = api.product.byId.useQuery(productId)

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({ title: '' })
  }, [navigation])

  useLayoutEffect(() => {
    if (product) navigation.setOptions({ title: product.name })
  }, [navigation, product])

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView>
          <View className='px-6 pb-2 pt-4'>
            {isLoading ? (
              <ProductDetailsSkeleton />
            ) : (
              product && (
                <>
                  <ImageViewer images={product.images} />
                  <ProductDetails productId={productId} />
                  <ProductSidebar />
                  <ReviewsSection productId={productId} />
                  <SimilarProducts />
                </>
              )
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
