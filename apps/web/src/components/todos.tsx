'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'

import { api } from '@/trpc/react'

export default function Todos() {
  const [task, setTask] = useState('')

  const [todos] = api.todo.get.useSuspenseQuery()
  const utils = api.useUtils()

  const addTodo = api.todo.add.useMutation({
    onMutate: async (formData) => {
      setTask('')

      await utils.todo.get.cancel()

      const oldTodos = utils.todo.get.getData()
      const newTodos = [...oldTodos!, { id: '0', task: formData.task }]
      utils.todo.get.setData(undefined, newTodos)

      return { oldTodos }
    },
    onError: (_, __, ctx) => {
      utils.todo.get.setData(undefined, ctx?.oldTodos)
    },
    onSettled: (newTodo) => {
      utils.todo.get.setData(undefined, (newTodos) => [
        ...newTodos!.slice(0, -1),
        newTodo!,
      ])

      // utils.todo.get.invalidate()
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!task) return
    addTodo.mutate({ task })
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.task}</li>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className='text-black'
        />

        <button>submit</button>
      </form>
    </ul>
  )
}
