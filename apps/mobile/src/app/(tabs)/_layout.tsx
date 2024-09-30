import Entypo from '@expo/vector-icons/Entypo'
import { Tabs } from 'expo-router'

export default function TabsNavigation() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#c82d2d',
        tabBarInactiveTintColor: '#333333',
        tabBarLabelStyle: { fontSize: 14, fontWeight: '700' },
        tabBarStyle: {
          position: 'absolute',
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
            <Entypo name='shopping-cart' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          tabBarLabel: 'البحث',
          tabBarIcon: ({ color, size }) => (
            <Entypo name='magnifying-glass' color={color} size={size} />
          ),
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
