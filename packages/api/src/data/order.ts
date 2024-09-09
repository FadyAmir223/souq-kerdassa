import type { DB, Order, Product, User } from '@repo/db/types'
import type { CreateOrderSchema } from '@repo/validators'
import { TRPCError } from '@trpc/server'
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
            city: true,
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
    return await db.$transaction(async (tx) => {
      const { id: addressId } = await tx.address.create({
        data: address,
        select: {
          id: true,
        },
      })

      const { id: orderId } = await tx.order.create({
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

      return orderId
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
