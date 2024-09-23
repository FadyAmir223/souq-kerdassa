import type { DB } from '@repo/db/types'
import type { CityCategorySchema } from '@repo/validators'
import { TRPCError } from '@trpc/server'

export async function getAllCities(db: DB) {
  try {
    const cities = await db.city.findMany({
      select: {
        id: true,
        name: true,
        cityCategoryPrice: {
          select: {
            price: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      price: city.cityCategoryPrice?.price,
    }))
  } catch {
    return []
  }
}

export async function getAllCategories(db: DB) {
  try {
    return db.cityCategoryPrice.findMany({
      select: {
        id: true,
        category: true,
        price: true,
      },
      orderBy: {
        price: 'asc',
      },
    })
  } catch {
    return []
  }
}

export async function updateCategoryPrice(db: DB, categories: CityCategorySchema) {
  try {
    await db.$transaction(
      categories.map((category) =>
        db.cityCategoryPrice.update({
          where: {
            id: category.id,
          },
          data: {
            price: category.price,
          },
          select: {
            id: true,
          },
        }),
      ),
    )
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error)
      if (error.code === 'P2025')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'القطاع غير موجود',
        })

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'تعذر تغيير سعر القطاع',
    })
  }
}
