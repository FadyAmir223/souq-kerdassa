import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Text, View } from 'react-native'

import { api } from '@/utils/api'

import ActionAddressForm from './action-address-form'
import { AddressSkeleton } from './address-skeleton'
import DeleteAddressForm from './delete-address-form'

export function Addresses() {
  const { data: addresses, isLoading } = api.user.addresses.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  if (isLoading) return <AddressSkeleton />

  if (addresses?.length === 0)
    return (
      <Text className='mt-10 text-center text-2xl font-bold'>لا يوجد عنوان</Text>
    )

  return (
    <View className='gap-4'>
      {addresses?.map((address) => (
        <View key={address.id} className='rounded-md bg-white px-4 py-5 shadow-md'>
          <View className='mb-3 flex-row justify-between'>
            <FontAwesome6 name='location-dot' size={24} />

            <View className='flex-row gap-x-2'>
              <ActionAddressForm action='edit' address={address} />
              <View className='relative mx-1 before:absolute before:h-full before:w-[2.5px] before:bg-black' />
              <DeleteAddressForm addressId={address.id} />
            </View>
          </View>

          <View>
            <Text className='text-xl font-bold'>
              <Text className='text-2xl'>المدينة: </Text>
              {address.city.name}
            </Text>
            <Text className='text-xl font-bold'>
              <Text className='text-2xl'>المنطقة: </Text>
              {address.region}
            </Text>
            <Text className='text-xl font-bold'>
              <Text className='text-2xl'>الشارع: </Text>
              {address.street}
            </Text>
            <Text className='text-xl font-bold'>
              <Text className='text-2xl'>المبنى: </Text>
              {address.building}
            </Text>
            <Text className='text-xl font-bold'>
              <Text className='text-2xl'>علامة مميزة: </Text>
              {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
              {address.mark || 'لا يوجد'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}
