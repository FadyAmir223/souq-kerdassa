import type { DB } from '@repo/db'
import type { Category, Product, Season } from '@repo/db/types'
import type { ProductTypeSchema } from '@repo/validators'

// TODO: ask whether to show the out of stock products

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

export async function getProductsByType({
  db,
  type,
  limit,
  page,
}: {
  db: DB
  type: ProductTypeSchema
  limit: number
  page: number
}) {
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
      select: productCardSelections,
      orderBy: {
        updatedAt: type === 'latest' ? 'desc' : undefined,
        rating: type === 'top-rated' ? 'desc' : undefined,
      },
      skip: (page - 1) * limit,
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

export async function getProductsBySeasonOrCategory({
  db,
  type,
  limit,
  page,
}: {
  db: DB
  type: Season | Category
  limit: number
  page: number
}) {
  try {
    const products = await db.product.findMany({
      where: {
        variants: {
          some: {
            season: type === 'summer' || type === 'winter' ? type : undefined,
            category: type === 'women' || type === 'children' ? type : undefined,
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
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
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
