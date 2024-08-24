import { authRouter } from './routers/auth'
import { todoRouter } from './routers/todo'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  todo: todoRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter
