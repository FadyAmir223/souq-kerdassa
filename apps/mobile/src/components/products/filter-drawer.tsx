import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal'

import type { ProductFilterParams } from '@/types/product'

const filters = [
  {
    title: 'ترتيب بالـ',
    key: 'type',
    options: [
      { label: 'الاحدث', value: 'latest' },
      { label: 'الاكثر تقييماً', value: 'top-rated' },
    ],
  },
  {
    title: 'الموسم',
    key: 'season',
    options: [
      { label: 'صيفى', value: 'summer' },
      { label: 'شتوى', value: 'winter' },
    ],
  },
  {
    title: 'الفئة',
    key: 'category',
    options: [
      { label: 'نساء', value: 'women' },
      { label: 'اطفال', value: 'children' },
    ],
  },
] as const

type FilterDrawerProps = {
  hasParams: boolean
}

export default function FilterDrawer({ hasParams }: FilterDrawerProps) {
  const [isOpen, setOpen] = useState(false)
  const searchParams = useLocalSearchParams<ProductFilterParams>()

  return (
    <>
      <Pressable
        className='mb-6 flex-row items-center gap-x-4 self-start rounded-md bg-white px-4 py-2 shadow-sm'
        onPress={() => setOpen(true)}
      >
        <Text className='text-2xl font-semibold text-primary'>فلتر</Text>
        <FontAwesome5 name='filter' color='#c62d2c' size={18} />
      </Pressable>

      <Modal
        isVisible={isOpen}
        onBackdropPress={() => setOpen(false)}
        onSwipeComplete={() => setOpen(false)}
        useNativeDriverForBackdrop
        swipeDirection='down'
        style={styles.view}
      >
        <View className='flex-[0.75] rounded-t-3xl bg-white px-6 pt-7'>
          <View className='mx-auto mb-10 mt-4 h-3 w-40 rounded-full bg-muted' />

          <Text className='mb-4 text-center text-3xl font-bold'>فلتر</Text>

          {hasParams && (
            <Pressable
              className='flex-row justify-end gap-x-3 text-destructive'
              onPress={() => router.replace({ pathname: '/products' })}
            >
              <Text className='text-2xl font-semibold text-primary'>مسح الفلتر</Text>
              <Ionicons name='close' size={26} color='#c62d2c' />
            </Pressable>
          )}

          <View>
            {filters.map((filter) => (
              <View key={filter.key} className='mt-5'>
                <Text className='mb-2 text-2xl font-semibold'>{filter.title}</Text>
                <View className='flex-row gap-x-2.5'>
                  {filter.options.map(({ label, value }) => (
                    <Pressable
                      key={label}
                      className='rounded-md border border-input bg-background px-4 py-2 text-primary shadow-lg'
                      onPress={() => router.setParams({ [filter.key]: value })}
                    >
                      <Text
                        className={`text-lg font-semibold ${value === searchParams[filter.key] && 'text-primary/80'}`}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
})
