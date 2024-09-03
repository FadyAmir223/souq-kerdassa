import { authRouter } from './routers/auth'
import { productRouter } from './routers/product'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  product: productRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter
