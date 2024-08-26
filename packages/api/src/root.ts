import { authRouter } from './routers/auth'
import { productRouter } from './routers/product'
import { todoRouter } from './routers/todo'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  todo: todoRouter,
  auth: authRouter,
  product: productRouter,
})

export type AppRouter = typeof appRouter
