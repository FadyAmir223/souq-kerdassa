import type {
  Category,
  DB,
  Prisma,
  Product,
  ProductVariant,
  Season,
  VisibilityStatus,
} from '@repo/db/types'
import type {
  AddProductImagePathsSchema,
  AdminProductsSchema,
  CreateOrderSchema,
  ProductsByFiltersSchema,
} from '@repo/validators'
import { TRPCError } from '@trpc/server'

import type { ProductByQuerySchema } from '../validations/products'

// TODO: cache products if possible

const productCardSelections = {
  id: true,
  images: true,
  name: true,
  price: true,
  rating: true,
  reviewsCount: true,
}

export async function getAllProducts(db: DB) {
  try {
    const products = await db.product.findMany({
      where: {
        visibility: 'active',
        variants: {
          every: {
            stock: {
              gt: 0,
            },
          },
        },
      },
      select: {
        id: true,
        images: true,
        name: true,
        price: true,
        rating: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10,
    })

    return products.map(({ images, ...product }) => ({
      ...product,
      image: images[0],
    }))
  } catch {
    return []
  }
}

export async function getProductIds(db: DB) {
  try {
    return await db.product.findMany({
      where: {
        visibility: 'active',
      },
      select: {
        id: true,
      },
    })
  } catch {
    return []
  }
}

export async function getProductById(db: DB, id: Product['id']) {
  try {
    return await db.product.findUnique({
      where: {
        id,
        visibility: 'active',
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        variants: {
          select: {
            id: true,
            season: true,
            category: true,
            stock: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}

export async function getProductsByFilters({
  db,
  limit,
  page,
  type,
  category,
  season,
}: {
  db: DB
  limit: ProductsByFiltersSchema['limit']
  page: ProductsByFiltersSchema['page']
  type?: ProductsByFiltersSchema['type']
  category?: Category
  season?: Season
}) {
  const query = {
    where: {
      visibility: 'active',
      variants: {
        some: {
          category,
          season,
        },
        every: {
          stock: {
            gt: 0,
          },
        },
      },
    },
    select: productCardSelections,
    orderBy: {
      createdAt: type === 'latest' ? 'desc' : undefined,
      rating: type === 'top-rated' ? 'desc' : undefined,
    },
    skip: (page - 1) * limit,
    take: limit,
  } satisfies Prisma.ProductFindManyArgs

  try {
    const [products, count] = await db.$transaction([
      db.product.findMany(query),
      db.product.count({ where: query.where }),
    ])

    return {
      products: products.map(({ images, ...product }) => ({
        ...product,
        image: images[0],
      })),
      total: count,
    }
  } catch {
    return { products: [], total: 0 }
  }
}

export async function getProductsByQuery({
  db,
  query,
  limit,
  cursor,
}: {
  db: DB
} & ProductByQuerySchema) {
  try {
    const products = await db.product.findMany({
      where: {
        visibility: 'active',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: productCardSelections,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const productsWithImage = products.map(({ images, ...product }) => ({
      ...product,
      image: images[0],
    }))

    let nextCursor: typeof cursor | undefined
    if (productsWithImage.length > limit) nextCursor = productsWithImage.pop()?.id

    return { products: productsWithImage, nextCursor }
  } catch {
    return { products: [] as Product[] }
  }
}

export async function getSimilarProducts(db: DB, limit: number) {
  try {
    const products = await db.product.findMany({
      where: {
        visibility: 'active',
        variants: {
          every: {
            stock: {
              gt: 0,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
        rating: true,
        reviewsCount: true,
      },
      take: limit,
    })

    return products.map(({ images, ...product }) => ({
      ...product,
      image: images[0],
    }))
  } catch {
    return []
  }
}

export async function getSoldOutVariants(
  db: DB,
  cartItems: CreateOrderSchema['cart'],
) {
  try {
    const variants = await db.productVariant.findMany({
      where: {
        id: {
          in: cartItems.map((item) => item.variantId),
        },
      },
      select: {
        id: true,
        stock: true,
      },
    })

    const variantMap = variants.reduce(
      (acc, variant) => {
        acc[variant.id] = variant.stock
        return acc
      },
      {} as Record<ProductVariant['id'], ProductVariant['stock'] | null>,
    )

    const soldOutVariants = cartItems
      .map((item) => {
        const stock = variantMap[item.variantId] ?? 0

        if (item.quantity > stock)
          return { variantId: item.variantId, remaining: stock }
      })
      .filter(Boolean)

    return soldOutVariants
  } catch {
    return []
  }
}

export async function getAdminProductsCount(
  db: DB,
  visibility?: Product['visibility'],
) {
  try {
    return await db.product.count({
      where: {
        visibility,
      },
    })
  } catch {
    return 0
  }
}

export async function getAdminProducts({
  db,
  limit,
  page,
  visibility,
}: {
  db: DB
  limit: AdminProductsSchema['limit']
  page: AdminProductsSchema['page']
  visibility?: Product['visibility']
}) {
  try {
    const products = await db.product.findMany({
      where: {
        visibility,
      },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        images: true,
        visibility: true,
        sales: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return products.map(({ images, ...attrs }) => ({
      ...attrs,
      image: images[0]!,
    }))
  } catch {
    return []
  }
}

export async function getAdminProductDetails(db: DB, productId: Product['id']) {
  try {
    return await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        visibility: true,
        variants: {
          select: {
            id: true,
            stock: true,
            season: true,
            category: true,
          },
        },
      },
    })
  } catch {
    return null
  }
}

export async function changeProductStatus({
  db,
  productId,
  visibility,
}: {
  db: DB
  productId: Product['id']
  visibility: VisibilityStatus
}) {
  try {
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        visibility,
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
          message: 'المنتج غير موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر تغيير حالة المنتج',
    })
  }
}

export async function addAdminProduct(db: DB, product: AddProductImagePathsSchema) {
  try {
    await db.product.create({
      data: {
        name: product.name,
        description: product.description,
        images: product.imagePaths,
        price: product.price,
        visibility: product.visibility,
        variants: {
          createMany: {
            data: product.variants.map((variant) => ({
              stock: variant.stock,
              season: variant.season,
              category: variant.category,
            })),
          },
        },
      },
      select: {
        id: true,
      },
    })
  } catch {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر إضافة المنتج',
    })
  }
}

export async function editAdminProduct(db: DB, product: AddProductImagePathsSchema) {
  try {
    await db.$transaction(async (tx) => {
      const productVariants = await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          name: product.name,
          description: product.description,
          images: product.imagePaths,
          price: product.price,
          visibility: product.visibility,
        },
        select: {
          variants: {
            select: {
              id: true,
            },
          },
        },
      })

      const existingVariantIds = productVariants.variants.map(({ id }) => id)
      const newVariantIds = product.variants.map(({ id }) => id)

      await tx.productVariant.deleteMany({
        where: {
          id: {
            in: existingVariantIds.filter((id) => !newVariantIds.includes(id)),
          },
        },
      })

      for (const variant of product.variants)
        await tx.productVariant.upsert({
          where: {
            id: variant.id ?? '',
          },
          create: {
            productId: product.id!,
            season: variant.season,
            category: variant.category,
            stock: variant.stock,
          },
          update: {
            season: variant.season,
            category: variant.category,
            stock: variant.stock,
          },
        })
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المنتج غير موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر تعديل المنتج',
    })
  }
}

export async function deleteAdminProduct(db: DB, productId: Product['id']) {
  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
      select: {
        images: true,
      },
    })

    return product.images[0] ?? ''
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المنتج غير موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر حذف المنتج',
    })
  }
}
