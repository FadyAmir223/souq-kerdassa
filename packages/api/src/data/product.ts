import type { DB } from '@repo/db'
import type { Product, Season } from '@repo/db/types'

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

export async function getLatestProducts(db: DB) {
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
      orderBy: {
        createdAt: 'desc',
      },
      select: productCardSelections,
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

export async function getProductsBySeason(db: DB, type: Season) {
  try {
    const products = await db.product.findMany({
      where: {
        variants: {
          some: {
            season: type,
          },
          every: {
            stock: {
              gt: 0,
            },
          },
        },
      },
      select: productCardSelections,
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

const searchLimit = 6

export async function getProductsByQuery({
  db,
  query,
  cursor,
}: {
  db: DB
  query: string
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
      take: searchLimit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' },
    })

    const productsWithImage = products.map(({ images, ...product }) => ({
      ...product,
      image: images[0],
    }))

    let nextCursor: typeof cursor | undefined
    if (productsWithImage.length > searchLimit)
      nextCursor = productsWithImage.pop()?.id

    return { products: productsWithImage, nextCursor }
  } catch {
    return { products: [] as Product[] }
  }
}
