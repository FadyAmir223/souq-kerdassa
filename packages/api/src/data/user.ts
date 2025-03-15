import type { Address, DB, Product, User } from '@repo/db/types'
import type {
  AddressSchema,
  AddressSchemaWithId,
  PaginationSchema,
} from '@repo/validators'
import { TRPCError } from '@trpc/server'
import { startOfMonth } from 'date-fns'

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

export async function editUserProfile(
  db: DB,
  user: Pick<User, 'id' | 'name' | 'phone'>,
) {
  try {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        phone: user.phone,
      },
      select: {
        id: true,
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002')
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'رقم التليفون موجود مسبقاً',
        })

      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR', // 'NOT_FOUND'
          message: 'تعذر تحديث البيانات', //'المستخدم ليس موجود'
        })
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر تحديث البيانات',
    })
  }
}

export async function getPurchaseStatus({
  db,
  userId,
  productId,
}: {
  db: DB
  userId?: User['id']
  productId: Product['id']
}) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        orders: {
          where: {
            status: 'completed',
            products: {
              some: {
                productId,
              },
            },
          },
          select: {
            id: true,
          },
          take: 1,
        },
      },
    })

    return !!user?.orders[0]?.id
  } catch {
    return {
      hasPurchased: false,
      hasReviewed: false,
    }
  }
}

export async function getPurchaseAndReviewStatus({
  db,
  userId,
  productId,
}: {
  db: DB
  userId?: User['id']
  productId: Product['id']
}) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        orders: {
          where: {
            status: 'completed',
            products: {
              some: {
                productId,
              },
            },
          },
          select: {
            id: true,
          },
          take: 1,
        },
        reviews: {
          where: {
            productId,
          },
          select: {
            id: true,
          },
          take: 1,
        },
      },
    })

    return {
      hasPurchased: !!user?.orders[0]?.id,
      hasReviewed: !!user?.reviews[0]?.id,
    }
  } catch {
    return {
      hasPurchased: false,
      hasReviewed: false,
    }
  }
}

export async function getAddresses(db: DB, userId: User['id']) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        addresses: {
          select: {
            id: true,
            city: {
              select: {
                id: true,
                name: true,
              },
            },
            region: true,
            street: true,
            building: true,
            mark: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    })

    return user?.addresses ?? []
  } catch {
    return []
  }
}

export async function addAddress({
  db,
  userId,
  address,
}: {
  db: DB
  userId: User['id']
  address: AddressSchema
}) {
  try {
    return await db.address.create({
      data: {
        userId,
        ...address,
      },
      select: {
        id: true,
        city: {
          select: {
            id: true,
            name: true,
          },
        },
        region: true,
        street: true,
        building: true,
        mark: true,
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2002')
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'العنوان موجود بالفعل',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر إضافة العنوان',
    })
  }
}

export async function editAddress({
  db,
  userId,
  address,
}: {
  db: DB
  userId: User['id']
  address: AddressSchemaWithId
}) {
  const { id: addressId, ...addressData } = address

  try {
    await db.address.update({
      where: {
        id: addressId,
        userId,
      },
      data: addressData,
      select: {
        id: true,
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'العنوان ليس موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر تحديث العنوان',
    })
  }
}

export async function deleteAddress({
  db,
  userId,
  addressId,
}: {
  db: DB
  userId: User['id']
  addressId: Address['id']
}) {
  try {
    await db.address.delete({
      where: {
        id: addressId,
        userId,
      },
      select: {
        id: true,
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'العنوان ليس موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر مسح العنوان',
    })
  }
}

export async function getAdminUsersCount(db: DB) {
  try {
    return await db.user.count({
      where: {
        role: 'USER',
      },
    })
  } catch {
    return 0
  }
}

export async function getAdminUsers({
  db,
  limit,
  page,
}: {
  db: DB
  limit: PaginationSchema['limit']
  page: PaginationSchema['page']
}) {
  try {
    const users = await db.user.findMany({
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        addresses: {
          select: {
            city: {
              select: {
                name: true,
              },
            },
          },
          take: 1,
        },
        orders: {
          where: {
            status: {
              in: ['pending', 'completed'],
            },
          },
          select: {
            totalPrice: true,
            status: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return users.map((user) => {
      const { totalPending, totalPaid } = user.orders.reduce(
        (acc, order) => {
          if (order.status === 'pending') acc.totalPending += order.totalPrice
          if (order.status === 'completed') acc.totalPaid += order.totalPrice
          return acc
        },
        { totalPending: 0, totalPaid: 0 },
      )

      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        city: user.addresses[0]?.city.name,
        orderCount: user.orders.length,
        totalPending,
        totalPaid,
      }
    })
  } catch {
    return []
  }
}

export async function getUserStatistics(db: DB) {
  const currentMonthStart = startOfMonth(new Date())

  try {
    const totalThisMonth = await db.user.count({
      where: {
        role: 'USER',
        createdAt: {
          gte: currentMonthStart,
        },
      },
    })

    return {
      totalThisMonth,
    }
  } catch {
    return {
      totalThisMonth: 0,
    }
  }
}
