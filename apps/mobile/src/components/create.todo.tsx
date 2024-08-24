import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'

import { api } from '@/utils/api'

export default function CreateTodo() {
  const utils = api.useUtils()

  const [task, setTask] = useState('')

  const { mutate, error } = api.todo.add.useMutation({
    async onSuccess() {
      setTask('')
      await utils.todo.get.invalidate()
    },
  })

  return (
    <View className='mt-4 flex gap-2'>
      <TextInput
        className='items-center rounded-md border border-input bg-background px-3 text-lg leading-tight text-foreground'
        value={task}
        onChangeText={setTask}
        placeholder='Task'
      />
      {error?.data?.zodError?.fieldErrors.task && (
        <Text className='mb-2 text-destructive'>
          {error.data.zodError.fieldErrors.task}
        </Text>
      )}
      <Pressable
        className='flex items-center rounded bg-primary p-2'
        onPress={() => {
          mutate({
            task,
          })
        }}
      >
        <Text className='text-foreground'>Create</Text>
      </Pressable>
    </View>
  )
}
