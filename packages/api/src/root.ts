import { authRouter } from './routers/auth'
import { ordersRouter } from './routers/order'
import { productRouter } from './routers/product'
import { userRouter } from './routers/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  product: productRouter,
  auth: authRouter,
  user: userRouter,
  order: ordersRouter,
})

export type AppRouter = typeof appRouter
