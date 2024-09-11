import type { DB } from '@repo/db/types'

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
