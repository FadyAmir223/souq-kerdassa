import { useCombinedStore } from '@repo/store/mobile'
import { Pressable, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { api } from '@/utils/api'
import { cn } from '@/utils/cn'

export default function CheckoutAddresses() {
  const { data: addresses } = api.user.addresses.all.useQuery(undefined, {
    gcTime: Infinity,
  })

  const { data: cities } = api.city.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  const { selectedAddress, setSelectedAddress } = useCombinedStore(
    useShallow(({ selectedAddress, setSelectedAddress }) => ({
      selectedAddress,
      setSelectedAddress,
    })),
  )

  return (
    <View className='grid gap-4 md:grid-cols-2'>
      {addresses?.map((address) => (
        <Pressable
          key={address.id}
          onPress={() => {
            setSelectedAddress({
              id: address.id,
              cityId: address.city.id,
              region: address.region,
              street: address.street,
              building: address.building,
              mark: address.mark,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              price: (cities ?? []).find(({ id }) => id === address.city.id)?.price!,
            })
          }}
          className={cn(
            'rounded-md border-2 border-transparent bg-white px-4 py-5 shadow-md',
            {
              'border-green-500': selectedAddress?.id === address.id,
              'border-destructive': selectedAddress === undefined,
            },
          )}
        >
          <Text className='self-start text-xl font-bold'>
            <Text className='text-2xl'>المدينة: </Text>
            {address.city.name}
          </Text>
          <Text className='self-start text-xl font-bold'>
            <Text className='text-2xl'>المنطقة: </Text>
            {address.region}
          </Text>
          <Text className='self-start text-xl font-bold'>
            <Text className='text-2xl'>الشارع: </Text>
            {address.street}
          </Text>
          <Text className='self-start text-xl font-bold'>
            <Text className='text-2xl'>المبنى: </Text>
            {address.building}
          </Text>
          <Text className='self-start text-xl font-bold'>
            <Text className='text-2xl'>علامة مميزة: </Text>
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
            {address.mark || 'لا يوجد'}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
