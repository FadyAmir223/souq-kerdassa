import type { Category, DB, Prisma, Product, VisibilityStatus } from '@repo/db/types'
import type {
  AddProductImagePathsSchema,
  AdminProductsSchema,
  ProductsByFiltersSchema,
} from '@repo/validators'
import { TRPCError } from '@trpc/server'

import type { ProductByQuerySchema } from '../validations/products'

type ProductEssentials = {
  id: string
  name: string
  image: string
  price: number
  discount: number | null
  rating: number
  reviewsCount: number
}[]

const productCardSelections = {
  id: true,
  images: true,
  name: true,
  rating: true,
  reviewsCount: true,
  variants: {
    select: {
      price: true,
      discount: true,
    },
    take: 1,
  },
} satisfies Prisma.ProductFindManyArgs['select']

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
        sizes: true,
        colors: true,
        images: true,
        seasons: true,
        variants: {
          select: {
            id: true,
            price: true,
            discount: true,
            category: true,
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
  cursor,
}: {
  db: DB
  limit: ProductsByFiltersSchema['limit']
  page: ProductsByFiltersSchema['page']
  type?: ProductsByFiltersSchema['type']
  category?: Category
  cursor?: string
}) {
  const isInfinite = page === -1

  const query = {
    where: {
      visibility: 'active',
      variants: {
        some: {
          category,
        },
      },
    },
    select: productCardSelections,
    orderBy: {
      createdAt: type === 'latest' ? 'desc' : undefined,
      rating: type === 'top-rated' ? 'desc' : undefined,
    },
    cursor: isInfinite && cursor ? { id: cursor } : undefined,
    skip: !isInfinite ? (page - 1) * limit : undefined,
    take: isInfinite ? limit + 1 : limit,
  } satisfies Prisma.ProductFindManyArgs

  try {
    let products, count: number | undefined

    if (isInfinite) products = await db.product.findMany(query)
    else
      [products, count] = await db.$transaction([
        db.product.findMany(query),
        // TODO: optimize to get only first time
        db.product.count({ where: query.where }),
      ])

    let nextCursor: typeof cursor | undefined
    if (products.length > limit) nextCursor = products.pop()?.id

    return {
      products: products.map(({ images, variants, ...product }) => {
        const selectedVariant = variants.reduce(
          (best, curr) =>
            !best ||
            (curr.discount ?? 0) < (best.discount ?? 0) ||
            (!curr.discount && !best.discount && curr.price < best.price)
              ? curr
              : best,
          null as null | (typeof variants)[0],
        )

        return {
          ...product,
          price: selectedVariant?.price,
          discount: selectedVariant?.discount,
          image: images[0]!,
        }
      }),
      total: count ?? 0,
      nextCursor,
    }
  } catch {
    return {
      products: [] as ProductEssentials,
      total: 0,
    }
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
      image: images[0]!,
    }))

    let nextCursor: typeof cursor | undefined
    if (productsWithImage.length > limit) nextCursor = productsWithImage.pop()?.id

    return { products: productsWithImage, nextCursor }
  } catch {
    return {
      products: [] as ProductEssentials,
    }
  }
}

export async function getSimilarProducts(db: DB, limit: number) {
  try {
    const products = await db.product.findMany({
      where: {
        visibility: 'active',
      },
      select: {
        id: true,
        name: true,
        images: true,
        rating: true,
        reviewsCount: true,
        variants: {
          select: {
            price: true,
            discount: true,
          },
          take: 1,
        },
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
        createdAt: true,
        images: true,
        visibility: true,
        variants: {
          select: {
            price: true,
            discount: true,
          },
          take: 1,
        },
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
        sizes: true,
        colors: true,
        images: true,
        visibility: true,
        seasons: true,
        variants: {
          select: {
            id: true,
            price: true,
            discount: true,
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
        sizes: product.sizes,
        colors: product.colors,
        visibility: product.visibility,
        seasons: product.seasons,
        variants: {
          createMany: {
            data: product.variants.map((variant) => ({
              price: variant.price,
              discount: variant.discount ? variant.discount : undefined,
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
          sizes: product.sizes,
          colors: product.colors,
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

      const deleteQuery = tx.productVariant.deleteMany({
        where: {
          id: {
            in: existingVariantIds.filter((id) => !newVariantIds.includes(id)),
          },
        },
      })

      const upsertQueries = product.variants.map((variant) =>
        tx.productVariant.upsert({
          where: {
            id: variant.id,
          },
          create: {
            productId: product.id!,
            price: variant.price,
            discount: variant.discount ? variant.discount : undefined,
            category: variant.category,
          },
          update: {
            price: variant.price,
            discount: variant.discount ? variant.discount : null,
            category: variant.category,
          },
        }),
      )

      await Promise.all([deleteQuery, ...upsertQueries])
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
