import { createId } from '@paralleldrive/cuid2'
import type {
  DB,
  Order,
  OrderStatus,
  Prisma,
  ProductVariant,
  User,
} from '@repo/db/types'
import type { AdminOrdersSchema, CreateOrderSchema } from '@repo/validators'
import { TRPCError } from '@trpc/server'
import { startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns'

async function changeOrderStatusWithStock({
  db,
  filters,
  from,
  to,
}: {
  db: DB
  filters: Prisma.OrderUpdateArgs['where']
  from: OrderStatus
  to: OrderStatus
}) {
  let action: 'none' | 'cancel' | 'order' = 'none'
  if (
    (from === 'pending' || from === 'completed') &&
    (to === 'cancelled' || to === 'refunded')
  )
    action = 'cancel'
  else if (
    (from === 'cancelled' || from === 'refunded') &&
    (to === 'pending' || to === 'completed')
  )
    action = 'order'

  await db.order.update({
    where: filters,
    data: {
      status: to,
    },
    select: {
      id: action === 'none',
      products:
        action !== 'none'
          ? {
              select: {
                productId: true,
                productVariantId: true,
                quantity: true,
              },
            }
          : undefined,
    },
  })
}

export async function getOrders(db: DB, userId: User['id']) {
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
            size: true,
            color: true,
            season: true,
            quantity: true,
            price: true,
            discount: true,
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
            productVariant: {
              select: {
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
        size: product.size,
        color: product.color,
        season: product.season,
        price: product.price,
        discount: product.discount,
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
  const groupedCartProductsVariants = cart.reduce(
    (acc, item) => {
      if (acc[item.variantId]) acc[item.variantId]! += item.quantity
      else acc[item.variantId] = item.quantity
      return acc
    },
    {} as Record<
      ProductVariant['id'],
      CreateOrderSchema['cart'][number]['quantity']
    >,
  )

  const productsVariantIds = Object.keys(groupedCartProductsVariants)

  try {
    const productVariants = await db.productVariant.findMany({
      where: {
        id: {
          in: productsVariantIds,
        },
      },
      select: {
        id: true,
        price: true,
        discount: true,
      },
    })

    const totalPrice = productVariants.reduce((total, variant) => {
      const quantity = groupedCartProductsVariants[variant.id]!
      return total + (variant.discount ?? variant.price) * quantity
    }, 0)

    const variantMapping = productVariants.reduce(
      (acc, variant) => {
        acc[variant.id] = { price: variant.price, discount: variant.discount }
        return acc
      },
      {} as Record<
        string,
        { price: ProductVariant['price']; discount: ProductVariant['discount'] }
      >,
    )

    const addressId = createId()

    await db.$transaction([
      db.address.create({
        data: {
          id: addressId,
          ...address,
        },
        select: {
          id: true,
        },
      }),
      db.order.create({
        data: {
          userId,
          addressId,
          totalPrice,
          products: {
            createMany: {
              data: cart.map((item) => ({
                quantity: item.quantity,
                price: variantMapping[item.variantId]?.price ?? 0,
                discount: variantMapping[item.variantId]?.discount,
                size: item.size,
                color: item.color,
                season: item.season,
                productId: item.id,
                productVariantId: item.variantId,
              })),
            },
          },
        },
        select: {
          id: true,
        },
      }),
    ])
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
    return changeOrderStatusWithStock({
      db,
      filters: { id: orderId, userId },
      from: 'pending',
      to: 'cancelled',
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
            size: true,
            color: true,
            season: true,
            quantity: true,
            product: {
              select: {
                name: true,
                images: true,
              },
            },
            productVariant: {
              select: {
                id: true,
                price: true,
                discount: true,
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
        size: product.size,
        color: product.color,
        season: product.season,
        name: product.product.name,
        image: product.product.images[0]!,
        category: product.productVariant.category,
        price: product.productVariant.price,
        discount: product.productVariant.discount,
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
  oldStatus,
  newStatus,
}: {
  db: DB
  orderId: Order['id']
  oldStatus: OrderStatus
  newStatus: OrderStatus
}) {
  try {
    return changeOrderStatusWithStock({
      db,
      filters: { id: orderId },
      from: oldStatus,
      to: newStatus,
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
