import Entypo from '@expo/vector-icons/Entypo'
import { useCombinedStore } from '@repo/store/mobile'
import { Tabs } from 'expo-router'
import { Platform, Text, View } from 'react-native'

export default function TabsNavigation() {
  const cartTotalQuantity = useCombinedStore((s) => s.getCartTotalQuantity())

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#c82d2d',
        tabBarInactiveTintColor: '#333333',
        tabBarLabelStyle: { fontSize: 14, fontWeight: '700' },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? '#cccccc' : 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Entypo name='home' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          tabBarLabel: 'العربة',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Entypo name='shopping-cart' color={color} size={size} />

              {cartTotalQuantity > 0 && (
                <View className='absolute right-[-8px] top-[-8px] size-5 items-center justify-center rounded-full bg-primary'>
                  <Text className='text-xs text-white'>{cartTotalQuantity}</Text>
                </View>
              )}
            </View>
          ),
          headerTitle: 'عربة التسوق',
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          tabBarLabel: 'البحث',
          tabBarIcon: ({ color, size }) => (
            <Entypo name='magnifying-glass' color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name='(account)'
        options={{
          tabBarLabel: 'الحساب',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name='user' color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
