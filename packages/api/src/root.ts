import { authRouter } from './routers/auth'
import { productRouter } from './routers/product'
import { userRouter } from './routers/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  product: productRouter,
  auth: authRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
