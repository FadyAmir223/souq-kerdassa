import { authRouter } from './routers/auth'
import { cityRouter } from './routers/city'
import { ordersRouter } from './routers/order'
import { postRouter } from './routers/post'
import { productRouter } from './routers/product'
import { userRouter } from './routers/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  product: productRouter,
  auth: authRouter,
  user: userRouter,
  order: ordersRouter,
  city: cityRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
