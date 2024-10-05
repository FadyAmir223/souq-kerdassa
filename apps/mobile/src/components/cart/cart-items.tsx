import FontAwesome from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useCombinedStore } from '@repo/store/mobile'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { AR } from '@/utils/constants'

import { Image } from '../image'
import CartItemSkeleton from './cart-item-skeleton'

export default function CartItems() {
  const { cart, incrementCartItem, decrementCartItem, deleteCartItem } =
    useCombinedStore(
      useShallow(
        ({ cart, incrementCartItem, decrementCartItem, deleteCartItem }) => ({
          cart,
          incrementCartItem,
          decrementCartItem,
          deleteCartItem,
        }),
      ),
    )

  const [isHydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!isHydrated)
    return (
      <View className='gap-y-3'>
        <CartItemSkeleton />
        <CartItemSkeleton />
      </View>
    )

  if (cart.length === 0)
    return (
      <View>
        <Text className='mb-12 mt-10 text-center text-3xl font-bold'>
          لا يوجد منتجات
        </Text>
        <Link
          href='/'
          className='self-center rounded-md bg-white px-4 py-2 text-2xl font-semibold shadow'
        >
          املأ عربة التسوق
        </Link>
      </View>
    )

  return (
    <View>
      <View>
        {cart.map((item) => (
          <View
            key={item.id + item.season + item.category}
            className='gap-y-2 rounded-md bg-white p-3'
          >
            <View className='flex-row gap-x-5'>
              <Link
                href={{ pathname: '/product/[id]', params: { id: item.id } }}
                asChild
              >
                <Pressable className='w-32'>
                  <Image
                    source={{ uri: item.image }}
                    className='aspect-[83/100] w-full'
                    resizeMode='cover'
                  />
                </Pressable>
              </Link>

              <View className='self-center'>
                <Text className='mb-2.5 text-3xl font-semibold'>{item.name}</Text>
                <View className='max-w-[5.5rem] gap-y-2'>
                  <Text className='rounded-md bg-primary px-2.5 py-0.5 text-center text-xl font-bold text-white'>
                    {AR.season[item.season]}
                  </Text>
                  <Text className='mb-1.5 rounded-md bg-sky-500 px-2.5 py-0.5 text-center text-xl font-bold text-white'>
                    {AR.category[item.category]}
                  </Text>
                </View>
              </View>
            </View>

            <Text className='text-2xl font-semibold text-primary'>
              {item.price} جنية
            </Text>

            <View className='flex-row items-center gap-x-7'>
              <View className='w-fit flex-row items-center gap-x-6 self-start border-2 border-gray-400 px-3 py-2'>
                <Pressable
                  className='grid size-5 place-items-center text-gray-400'
                  onPress={() => incrementCartItem(item.variantId)}
                >
                  <FontAwesome name='plus' size={18} />
                </Pressable>

                <Text className='text-xl font-semibold text-gray-600'>
                  {item.quantity}
                </Text>

                <Pressable
                  className='grid size-5 place-items-center text-gray-400'
                  onPress={() => decrementCartItem(item.variantId)}
                >
                  <FontAwesome name='minus' size={18} />
                </Pressable>
              </View>

              <Pressable
                className='text-destructive'
                onPress={() => deleteCartItem(item.variantId)}
              >
                <Ionicons name='close' color='#dc2626' size={32} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View className='mt-7 flex flex-col justify-between gap-y-4'>
        {(
          [
            {
              label: 'مواصلة التسوق',
              url: '/',
              iconProps: {
                name: 'keyboard-double-arrow-right',
              },
            },
            {
              label: 'الدفع',
              url: '/checkout',
              iconProps: {
                name: 'keyboard-double-arrow-left',
                color: 'white',
              },
            },
          ] as const
        ).map(({ label, url, iconProps }, idx) => (
          <Link key={label} href={url} asChild>
            <Pressable
              className={`flex-row items-center justify-between rounded-md px-4 shadow ${idx === 0 ? 'flex-row-reverse bg-white' : 'bg-primary'}`}
            >
              <Text
                className={`items-center justify-between py-5 text-[1.375rem] font-semibold ${idx === 1 && 'text-white'}`}
              >
                {label}
              </Text>
              <MaterialIcons size={26} {...iconProps} />
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  )
}
