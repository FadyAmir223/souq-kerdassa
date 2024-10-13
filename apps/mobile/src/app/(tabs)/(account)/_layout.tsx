import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import type { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { Redirect, withLayoutContext } from 'expo-router'
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native'

import { useUser } from '@/utils/auth/auth'

const { Navigator } = createMaterialTopTabNavigator()

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

export default function TabsAccountNavigation() {
  const { user, isFetching } = useUser()

  if (isFetching)
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' />
      </View>
    )

  if (!user) return <Redirect href='/login' />

  return (
    <SafeAreaView
      className='flex-1'
      style={Platform.select({
        android: {
          marginTop: StatusBar.currentHeight,
        },
      })}
    >
      <MaterialTopTabs
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 18,
            fontWeight: 600,
          },
          tabBarItemStyle: {
            width: 100,
          },
          tabBarContentContainerStyle: {
            justifyContent: 'center',
          },
          tabBarIndicatorStyle: {
            left: '16.67%',
          },
        }}
      >
        <MaterialTopTabs.Screen name='index' options={{ title: 'الحساب' }} />
        <MaterialTopTabs.Screen name='addresses' options={{ title: 'عناوينى' }} />
        <MaterialTopTabs.Screen name='orders' options={{ title: 'طلباتى' }} />
      </MaterialTopTabs>
    </SafeAreaView>
  )
}
