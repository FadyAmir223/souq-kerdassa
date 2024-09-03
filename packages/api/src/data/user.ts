import type { DB, User } from '@repo/db/types'
import { TRPCError } from '@trpc/server'

export async function createUser(
  db: DB,
  user: Pick<User, 'name' | 'phone' | 'password'>,
) {
  try {
    await db.user.create({
      data: user,
      select: {
        id: true,
      },
    })
  } catch (error) {
    // ? why this is falsy despite being the same class?
    // if (error instanceof Prisma.PrismaClientKnownRequestError)

    // workaround
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2002')
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'رقم التليفون موجود مسبقاً',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر إنشاء المستخدم',
    })
  }
}
