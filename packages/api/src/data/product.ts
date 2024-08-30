import type { Category, DB, Prisma, Product, Season } from '@repo/db/types'
import type { ProductTypeSchema } from '@repo/validators'

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
  try {
    const query = {
      where: {
        variants: {
          every: {
            category,
            season,
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

export async function getProductsByQuery({
  db,
  query,
  limit,
  cursor,
}: {
  db: DB
  query: string
  limit: number
  cursor?: string
}) {
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
