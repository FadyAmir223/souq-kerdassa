import FontAwesome from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useCombinedStore } from '@repo/store/mobile'
import { Link } from 'expo-router'
import { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { cn } from '@/utils/cn'
import { AR } from '@/utils/constants'
import { invertColor } from '@/utils/helpers/invert-number'

import { Image } from '../image'

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

  useEffect(() => {
    for (const item of cart)
      if (item.quantity === 0)
        deleteCartItem({
          itemVariantId: item.variantId,
          itemSize: item.size,
          itemColor: item.color,
        })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      <View className='gap-y-4'>
        {cart.map((item) => (
          <View
            key={item.id + item.season + item.category + item.size + item.color}
            className='ios:border ios:border-black gap-y-2 rounded-md bg-white p-3'
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
                <View className='w-20 gap-y-2'>
                  <Text className='rounded-md bg-primary px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                    {AR.season[item.season]}
                  </Text>
                  <Text className='mb-1.5 rounded-md bg-sky-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                    {AR.category[item.category]}
                  </Text>
                  <View className='flex-row gap-x-2'>
                    <Text className='w-24 rounded-md bg-indigo-500 px-2.5 py-0.5 text-center text-lg font-bold text-white'>
                      الحجم {item.size}
                    </Text>
                    <Text
                      className='w-14 rounded-md px-2.5 py-0.5 text-center text-lg font-bold text-white'
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
            </View>

            <View className='flex-row gap-x-2'>
              <Text
                className={cn('ios:self-start text-2xl font-semibold text-primary', {
                  'text-primary/60 line-through': item.discount,
                })}
              >
                {item.price}
              </Text>

              {!!item.discount && (
                <Text className='ios:self-start text-2xl font-semibold text-primary'>
                  {item.discount}
                </Text>
              )}

              <Text className='ios:self-start text-2xl font-semibold text-primary'>
                جنية
              </Text>
            </View>

            <View className='flex-row items-center gap-x-7'>
              <View className='w-fit flex-row items-center gap-x-6 self-start border-2 border-gray-400 px-3 py-2'>
                <Pressable
                  className='grid size-5 place-items-center text-gray-400'
                  onPress={() =>
                    incrementCartItem({
                      itemVariantId: item.variantId,
                      itemSize: item.size,
                      itemColor: item.color,
                    })
                  }
                >
                  <FontAwesome name='plus' size={18} />
                </Pressable>

                <Text className='text-xl font-semibold text-gray-600'>
                  {item.quantity}
                </Text>

                <Pressable
                  className='grid size-5 place-items-center text-gray-400'
                  onPress={() =>
                    decrementCartItem({
                      itemVariantId: item.variantId,
                      itemSize: item.size,
                      itemColor: item.color,
                    })
                  }
                >
                  <FontAwesome name='minus' size={18} />
                </Pressable>
              </View>

              <Pressable
                className='text-destructive'
                onPress={() =>
                  deleteCartItem({
                    itemVariantId: item.variantId,
                    itemSize: item.size,
                    itemColor: item.color,
                  })
                }
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
              className={cn(
                'android:shadow ios:border ios:border-black flex-row items-center justify-between rounded-md px-4',
                idx === 0 ? 'flex-row-reverse bg-white' : 'bg-primary',
              )}
            >
              <Text
                className={cn(
                  'items-center justify-between py-3 text-[1.375rem] font-semibold',
                  { 'text-white': idx === 1 },
                )}
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
