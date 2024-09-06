import type { Category, DB, Prisma, Product, Season } from '@repo/db/types'
import type { CreateOrderSchema, ProductTypeSchema } from '@repo/validators'

import type { ProductByQuerySchema } from '../validations/products'

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

export async function getProductById(db: DB, id: Product['id']) {
  try {
    return await db.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        rating: true,
        variants: {
          select: {
            season: true,
            category: true,
            stock: true,
          },
        },
        reviewsCount: true,
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
  limit: number
  page: number
  type?: ProductTypeSchema
  category?: Category
  season?: Season
}) {
  const query = {
    where: {
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
      updatedAt: type === 'latest' ? 'desc' : undefined,
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

export async function getSoldOutProducts(
  db: DB,
  cartItems: CreateOrderSchema['cart'],
) {
  try {
    // TODO: save productVariant id in cart store to index it
    await db.$transaction(
      cartItems.map((item) =>
        db.productVariant.findFirst({
          where: {
            productId: item.id,
            season: item.season,
            category: item.category,
          },
          select: {
            stock: true,
          },
        }),
      ),
    )
  } catch {
    return null
  }
}
