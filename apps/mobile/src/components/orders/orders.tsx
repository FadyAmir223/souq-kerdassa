import { MaterialIcons } from '@expo/vector-icons'
import type { Category, Order, Season } from '@repo/db/types'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

import { api } from '@/utils/api'
import { cn } from '@/utils/cn'
import { AR } from '@/utils/constants'
import { invertColor } from '@/utils/helpers/invert-number'

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
        (acc, { price, discount, quantity }) => acc + (discount ?? price) * quantity,
        0,
      ) + shippingCost

    return (
      <View
        key={order.id}
        className='android:shadow-md ios:border ios:border-black rounded-md bg-white p-4'
      >
        <View className='mb-4 flex-row justify-between border-b border-b-gray-400 pb-4'>
          <View>
            <Text className='text-xl font-bold'>وقت الطلب</Text>
            <Text className='inline-block self-start text-black/80'>
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
                className={cn('size-2 rounded-full', {
                  'bg-yellow-500': status === 'pending',
                  'bg-green-500': status === 'completed',
                  'bg-gray-500': status === 'cancelled',
                  'bg-orange-500': status === 'refunded',
                })}
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
                  <Text className='mb-2 self-start text-xl font-bold'>
                    {item.name}
                  </Text>
                  <Text className='mb-1.5 w-20 rounded-md bg-primary px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                    {AR.season[item.season as Season]}
                  </Text>
                  <Text className='mb-1.5 w-20 rounded-md bg-sky-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                    {AR.category[item.category as Category]}
                  </Text>
                  <View className='flex-row gap-x-2'>
                    <Text className='mb-1.5 w-24 rounded-md bg-indigo-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                      الحجم {item.size}
                    </Text>
                    <Text
                      className='mb-1.5 w-12 rounded-md px-2.5 py-0.5 text-center text-lg font-bold text-white'
                      style={{ backgroundColor: item.color }}
                    >
                      <MaterialIcons
                        name='colorize'
                        size={20}
                        style={{ color: invertColor(item.color) }}
                      />
                    </Text>
                  </View>
                </View>
              </View>

              <View className='w-[10.5rem]'>
                <Text className='self-start text-lg'>
                  <Text className='text-xl font-bold'>الكمية: </Text>
                  {item.quantity}
                </Text>
                <Text className='self-start text-lg'>
                  <Text className='text-xl font-bold'>السعر: </Text>
                  {item.price}
                </Text>
                {!!item.discount && (
                  <Text className='self-start text-lg'>
                    <Text className='text-xl font-bold'>بعد الخصم: </Text>
                    {item.discount}
                  </Text>
                )}
                <Text className='mt-1.5 border-t border-t-gray-400 pt-1.5 text-lg'>
                  <Text className='text-xl font-bold'>السعر الكلى: </Text>
                  {(item.discount ?? item.price) * item.quantity}
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
