import Entypo from '@expo/vector-icons/Entypo'
import { Tabs } from 'expo-router'

export default function TabsNavigation() {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: '#000000',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
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
        name='home'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name='home' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name='shopping-cart' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name='magnifying-glass' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='(account)'
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Entypo name='user' color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
