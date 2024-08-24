import { Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AuthShowcase from '@/components/auth-showcase'
import CreateTodo from '@/components/create.todo'
import ZustandShowcase from '@/components/zustand-showcase'
import { api } from '@/utils/api'

export default function Index() {
  const todoQuery = api.todo.get.useQuery()

  return (
    <SafeAreaView className='bg-background'>
      <Stack.Screen options={{ title: 'Home Page' }} />
      <View className='size-full bg-background p-4'>
        <ZustandShowcase />
        <AuthShowcase />

        <CreateTodo />
        <View className='py-2'>
          {todoQuery.data?.map(({ id, task }) => <Text key={id}>{task}</Text>)}
        </View>
      </View>
    </SafeAreaView>
  )
}
