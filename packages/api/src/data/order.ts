import type { DB, Order, OrderStatus, Product, User } from '@repo/db/types'
import type { AdminOrdersSchema, CreateOrderSchema } from '@repo/validators'
import { TRPCError } from '@trpc/server'
import { startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns'

export async function getOrders(db: DB, userId: User['id']) {
  await new Promise((r) => setTimeout(r, 2000))
  try {
    const orders = await db.order.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        products: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
            productVariant: {
              select: {
                season: true,
                category: true,
              },
            },
          },
        },
        address: {
          select: {
            city: {
              select: {
                name: true,
                cityCategoryPrice: {
                  select: {
                    price: true,
                  },
                },
              },
            },
            region: true,
            street: true,
            building: true,
            mark: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    return orders.map((order) => ({
      ...order,
      products: order.products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        productId: product.product.id,
        name: product.product.name,
        price: product.product.price,
        image: product.product.images[0] ?? '',
        ...product.productVariant,
      })),
    }))
  } catch {
    return []
  }
}

export async function createOrder({
  db,
  userId,
  address,
  cart,
}: {
  db: DB
  userId: User['id']
  address: CreateOrderSchema['address']
  cart: CreateOrderSchema['cart']
}) {
  // why make multiple queries for same product

  const groupedCartProducts = cart.reduce(
    (acc, item) => {
      if (acc[item.id]) acc[item.id]! += item.quantity
      else acc[item.id] = item.quantity
      return acc
    },
    {} as Record<Product['id'], CreateOrderSchema['cart'][number]['quantity']>,
  )

  try {
    const products = await db.product.findMany({
      where: {
        id: {
          in: Object.keys(groupedCartProducts),
        },
      },
      select: {
        id: true,
        price: true,
      },
    })

    const totalPrice = products.reduce((total, product) => {
      const quantity = groupedCartProducts[product.id]!
      return total + product.price * quantity
    }, 0)

    // careful with performance
    await db.$transaction(async (tx) => {
      const { id: addressId } = await tx.address.create({
        data: address,
        select: {
          id: true,
        },
      })

      await tx.order.create({
        data: {
          userId,
          addressId,
          totalPrice,
          products: {
            createMany: {
              data: cart.map((item) => ({
                productId: item.id,
                productVariantId: item.variantId,
                quantity: item.quantity,
              })),
            },
          },
        },
        select: {
          id: true,
        },
      })

      for (const product of products)
        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            sales: {
              increment: groupedCartProducts[product.id],
            },
          },
          select: {
            id: true,
          },
        })

      for (const item of cart)
        await tx.productVariant.update({
          where: {
            id: item.variantId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'منتج تم حذفه',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر تسجيل الطلب',
    })
  }
}

export async function cancelOrder({
  db,
  userId,
  orderId,
}: {
  db: DB
  userId: User['id']
  orderId: Order['id']
}) {
  try {
    await db.order.update({
      where: {
        id: orderId,
        userId,
      },
      data: {
        status: 'cancelled',
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
          message: 'الطلب ليس موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر إلغاء الطلب',
    })
  }
}

export async function getAdminOrdersCount(db: DB, status?: OrderStatus) {
  try {
    return db.order.count({
      where: {
        status,
      },
    })
  } catch {
    return 0
  }
}

export async function getAdminOrders({
  db,
  limit,
  page,
  status,
}: {
  db: DB
  limit: AdminOrdersSchema['limit']
  page: AdminOrdersSchema['page']
  status?: OrderStatus
}) {
  try {
    const orders = await db.order.findMany({
      where: {
        status,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        totalPrice: true,
        products: {
          select: {
            quantity: true,
          },
        },
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return orders.map(({ products, ...order }) => ({
      ...order,
      quantity: products.reduce((acc, { quantity }) => acc + quantity, 0),
    }))
  } catch {
    return []
  }
}

export async function getAdminOrderDetails(db: DB, orderId: Order['id']) {
  try {
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        totalPrice: true,
        status: true,
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
        products: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                price: true,
                images: true,
              },
            },
            productVariant: {
              select: {
                id: true,
                season: true,
                category: true,
              },
            },
          },
        },
        address: {
          select: {
            city: {
              select: {
                name: true,
                cityCategoryPrice: true,
              },
            },
            region: true,
            street: true,
            building: true,
            mark: true,
          },
        },
        createdAt: true,
      },
    })

    return {
      totalPrice: order?.totalPrice ?? 0,
      shipping: order?.address.city.cityCategoryPrice?.price ?? 0,
      user: order?.user,
      createdAt: order?.createdAt,
      status: order?.status,
      address: {
        ...order?.address,
        city: order?.address.city.name,
      },
      products: order?.products.map((product) => ({
        id: product.productVariant.id,
        quantity: product.quantity,
        name: product.product.name,
        price: product.product.price,
        image: product.product.images[0]!,
        season: product.productVariant.season,
        category: product.productVariant.category,
      })),
    }
  } catch {
    return null
  }
}

export async function getOrderStatistics(db: DB) {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 6 })
  const currentMonthStart = startOfMonth(new Date())
  const previousMonthStart = subMonths(currentMonthStart, 1)
  const twoMonthsAgoStart = subMonths(currentMonthStart, 2)

  try {
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: twoMonthsAgoStart,
        },
        status: 'completed',
      },
      select: {
        createdAt: true,
        totalPrice: true,
      },
    })

    const { totalThisWeek, totalPreviousWeek, totalThisMonth, totalPreviousMonth } =
      orders.reduce(
        (acc, order) => {
          const createdAt = order.createdAt.getTime()

          if (createdAt >= currentWeekStart.getTime())
            acc.totalThisWeek += order.totalPrice
          else if (createdAt >= subWeeks(currentWeekStart, 1).getTime())
            acc.totalPreviousWeek += order.totalPrice

          if (createdAt >= currentMonthStart.getTime())
            acc.totalThisMonth += order.totalPrice
          else if (createdAt >= previousMonthStart.getTime())
            acc.totalPreviousMonth += order.totalPrice

          return acc
        },
        {
          totalThisWeek: 0,
          totalPreviousWeek: 0,
          totalThisMonth: 0,
          totalPreviousMonth: 0,
        },
      )

    const weeklyPercentageChange =
      totalPreviousWeek > 0 ? (totalThisWeek / totalPreviousWeek) * 100 : 100

    const monthlyPercentageChange =
      totalPreviousMonth > 0 ? (totalThisMonth / totalPreviousMonth) * 100 : 100

    return {
      totalThisWeek,
      weeklyPercentageChange,
      totalThisMonth,
      monthlyPercentageChange,
    }
  } catch {
    return {}
  }
}

export async function changeOrderStatus({
  db,
  orderId,
  status,
}: {
  db: DB
  orderId: Order['id']
  status: OrderStatus
}) {
  try {
    await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
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
          message: 'الطلب غير موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر تغيير حالة الطلب',
    })
  }
}

export async function getOrderAllTimeStatistics(db: DB) {
  try {
    const result = await db.order.groupBy({
      by: ['status'],
      where: {
        status: {
          in: ['completed', 'pending'],
        },
      },
      _sum: {
        totalPrice: true,
      },
    })

    return result.reduce(
      (acc, curr) => {
        if (curr.status === 'completed')
          acc.totalAllTime += curr._sum.totalPrice ?? 0
        if (curr.status === 'pending')
          acc.pendingAllTime += curr._sum.totalPrice ?? 0

        return acc
      },
      {
        totalAllTime: 0,
        pendingAllTime: 0,
      },
    )
  } catch {
    return {
      totalAllTime: 0,
      pendingAllTime: 0,
    }
  }
}
