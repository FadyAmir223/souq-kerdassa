import type { Product, ProductVariant } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const description =
  'تحتوي عبايتنا صيفيه على تفاصيل رائعة مثل التطريزات والزخارف الفاخرة، والتي تضفي على العباية لمسة رائعة من الجمال والأناقة لتحصلي على إطلالة متألقة وأنيقة في المناسبات والحفلات'

const PRODUCTS = [
  {
    name: 'mona - 1',
    description,
    images: [1, 2, 3].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 3,
    variants: [
      { season: 'SUMMER', category: 'WOMEN', stock: 5 },
      { season: 'WINTER', category: 'CHILDREN', stock: 3 },
    ],
  },
  {
    name: 'mona - 2',
    description,
    images: [4, 5].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 3.3,
    variants: [
      { season: 'SUMMER', category: 'CHILDREN', stock: 0 },
      { season: 'SUMMER', category: 'WOMEN', stock: 0 },
      { season: 'WINTER', category: 'CHILDREN', stock: 3 },
      { season: 'WINTER', category: 'WOMEN', stock: 3 },
    ],
  },
  {
    name: 'mona - 3',
    description,
    images: [7, 8, 9, 10].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 5,
    variants: [
      { season: 'SUMMER', category: 'WOMEN', stock: 5 },
      { season: 'WINTER', category: 'CHILDREN', stock: 3 },
      { season: 'WINTER', category: 'WOMEN', stock: 3 },
    ],
  },
  {
    name: 'mona - 4',
    description,
    images: [11, 12, 13].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'WINTER', category: 'CHILDREN', stock: 3 }],
  },
  {
    name: 'mona - 5',
    description,
    images: [16, 17].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'SUMMER', category: 'WOMEN', stock: 5 }],
  },
  {
    name: 'soha - 1',
    description,
    images: [1, 2].map((i) => `models/soha/${i}.png`),
    price: 400,
    rating: 4.6,
    variants: [
      { season: 'SUMMER', category: 'WOMEN', stock: 5 },
      { season: 'WINTER', category: 'CHILDREN', stock: 3 },
    ],
  },
  {
    name: 'toqa - 1',
    description,
    images: [5, 6, 7].map((i) => `models/toqa/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [
      { season: 'SUMMER', category: 'WOMEN', stock: 5 },
      { season: 'WINTER', category: 'CHILDREN', stock: 3 },
    ],
  },
] as const satisfies Partial<Product & { variants: Partial<ProductVariant>[] }>[]

async function main() {
  await Promise.all(
    PRODUCTS.map(({ variants, ...product }) =>
      db.product.upsert({
        where: { name: product.name },
        update: {},
        create: {
          ...product,
          variants: {
            createMany: {
              data: variants,
            },
          },
        },
        select: { id: true },
      }),
    ),
  )
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })