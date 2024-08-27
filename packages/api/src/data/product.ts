import type { DB } from '@repo/db'
import type { Product, Season } from '@repo/db/types'

export async function getAllProducts(db: DB) {
  try {
    const products = await db.product.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        images: true,
        name: true,
        price: true,
        rating: true,
        reviewsCount: true,
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

export async function getProductsBySeason(db: DB, type: Season) {
  try {
    const products = await db.product.findMany({
      where: {
        variants: {
          some: {
            season: type,
          },
        },
      },
      select: {
        id: true,
        images: true,
        name: true,
        price: true,
        rating: true,
        reviewsCount: true,
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

export async function getSimilarProducts(db: DB, limit: number) {
  try {
    const products = await db.product.findMany({
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
