import type { Category, Order, Season } from '@repo/db/types'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

import { api } from '@/utils/api'
import { AR } from '@/utils/constants'

import { Image } from '../image'
import CancelOrderButton from './cancel-order-button'
import OrderSkeleton from './order-skeleton'

export function Orders() {
  const { data: orders, isLoading } = api.order.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  if (isLoading) return <OrderSkeleton />

  if (orders?.length === 0)
    return <Text className='mt-6 text-center text-xl font-bold'>لا يوجد طلبات</Text>

  return orders?.map((order) => {
    const status = order.status as Order['status']

    const shippingCost = order.address.city.cityCategoryPrice?.price ?? 0

    const totalPrice =
      order.products.reduce(
        (acc, { price, quantity }) => acc + price * quantity,
        0,
      ) + shippingCost

    return (
      <View key={order.id} className='rounded-md bg-white p-4 shadow-md'>
        <View className='mb-4 flex-row justify-between border-b border-b-gray-400 pb-4'>
          <View>
            <Text className='text-xl font-bold'>وقت الطلب</Text>
            <Text className='inline-block text-black/80'>
              {formatDistanceToNow(order.createdAt, {
                addSuffix: true,
                locale: ar,
              })}
            </Text>
          </View>

          <View className='flex-row items-center gap-x-2'>
            <Text className='text-xl font-bold'>{AR.status[status]}</Text>
            <View className='size-6 items-center justify-center'>
              <View
                className={`size-2 rounded-full ${status === 'pending' ? 'bg-yellow-500' : ''} ${status === 'completed' ? 'bg-green-500' : ''} ${status === 'cancelled' ? 'bg-gray-500' : ''} ${status === 'refunded' ? 'bg-orange-500' : ''}`}
              />
            </View>
          </View>
        </View>

        <View>
          {order.products.map((item) => (
            <View
              key={item.id}
              className='mb-4 justify-between gap-y-4 border-b border-b-gray-400 pb-4'
            >
              <View className='flex-row items-center gap-x-4'>
                <Link
                  href={{
                    pathname: '/product/[id]',
                    params: { id: item.productId },
                  }}
                >
                  <View className='w-32 overflow-hidden rounded-md bg-neutral-500/50'>
                    <Image
                      source={{ uri: item.image }}
                      resizeMode='cover'
                      className='aspect-[83/100] w-full'
                    />
                  </View>
                </Link>

                <View>
                  <Text className='mb-2 text-xl font-bold'>{item.name}</Text>
                  <Text className='mb-1.5 w-20 rounded-md bg-primary px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                    {AR.season[item.season as Season]}
                  </Text>
                  <Text className='mb-1.5 w-20 rounded-md bg-sky-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                    {AR.category[item.category as Category]}
                  </Text>
                </View>
              </View>

              <View className='w-[10.5rem]'>
                <Text className='text-lg'>
                  <Text className='text-xl font-bold'>الكمية: </Text>
                  {item.quantity}
                </Text>
                <Text className='text-lg'>
                  <Text className='text-xl font-bold'>السعر: </Text>
                  {item.price}
                </Text>
                <Text className='mt-1.5 border-t border-t-gray-400 pt-1.5 text-lg'>
                  <Text className='text-xl font-bold'>السعر الكلى: </Text>
                  {item.price * item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className='flex-row items-center justify-between border-t-gray-400'>
          {status === 'pending' && <CancelOrderButton orderId={order.id} />}

          <View className='ms-auto'>
            <Text className='text-lg font-bold'>الشحن: {shippingCost} جنية</Text>
            <Text className='text-lg font-bold text-primary'>
              المجموع: {totalPrice} جنية
            </Text>
          </View>

          {/* TODO: arrival address ui ? */}
        </View>
      </View>
    )
  })
}