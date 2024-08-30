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
      { season: 'summer', category: 'women', stock: 5 },
      { season: 'winter', category: 'children', stock: 3 },
    ],
  },
  {
    name: 'mona - 2',
    description,
    images: [4, 5].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 3.3,
    variants: [
      { season: 'summer', category: 'children', stock: 0 },
      { season: 'summer', category: 'women', stock: 0 },
      { season: 'winter', category: 'children', stock: 3 },
      { season: 'winter', category: 'women', stock: 3 },
    ],
  },
  {
    name: 'mona - 3',
    description,
    images: [7, 8, 9, 10].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 5,
    variants: [
      { season: 'summer', category: 'women', stock: 5 },
      { season: 'winter', category: 'children', stock: 3 },
      { season: 'winter', category: 'women', stock: 3 },
    ],
  },
  {
    name: 'mona - 4',
    description,
    images: [11, 12, 13].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'winter', category: 'children', stock: 3 }],
  },
  {
    name: 'mona - 5',
    description,
    images: [16, 17].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'summer', category: 'women', stock: 5 }],
  },
  {
    name: 'soha - 1',
    description,
    images: [1, 2].map((i) => `models/soha/${i}.png`),
    price: 400,
    rating: 4.6,
    variants: [
      { season: 'summer', category: 'women', stock: 5 },
      { season: 'winter', category: 'children', stock: 3 },
    ],
  },
  {
    name: 'toqa - 1',
    description,
    images: [5, 6, 7].map((i) => `models/toqa/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [
      { season: 'summer', category: 'women', stock: 5 },
      { season: 'winter', category: 'children', stock: 3 },
    ],
  },

  {
    name: 'mona - 10',
    description,
    images: [1, 2, 3].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 3,
    variants: [{ season: 'summer', category: 'women', stock: 5 }],
  },
  {
    name: 'mona - 20',
    description,
    images: [4, 5].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 3.3,
    variants: [{ season: 'summer', category: 'children', stock: 0 }],
  },
  {
    name: 'mona - 30',
    description,
    images: [7, 8, 9, 10].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 5,
    variants: [{ season: 'summer', category: 'women', stock: 5 }],
  },
  {
    name: 'mona - 40',
    description,
    images: [11, 12, 13].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'summer', category: 'children', stock: 3 }],
  },
  {
    name: 'mona - 50',
    description,
    images: [16, 17].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'summer', category: 'women', stock: 5 }],
  },
  {
    name: 'soha - 10',
    description,
    images: [1, 2].map((i) => `models/soha/${i}.png`),
    price: 400,
    rating: 4.6,
    variants: [{ season: 'summer', category: 'women', stock: 5 }],
  },
  {
    name: 'toqa - 10',
    description,
    images: [5, 6, 7].map((i) => `models/toqa/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'summer', category: 'women', stock: 5 }],
  },

  {
    name: 'mona - 100',
    description,
    images: [1, 2, 3].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 3,
    variants: [{ season: 'winter', category: 'children', stock: 3 }],
  },
  {
    name: 'mona - 200',
    description,
    images: [4, 5].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 3.3,
    variants: [
      { season: 'winter', category: 'children', stock: 3 },
      { season: 'winter', category: 'women', stock: 3 },
    ],
  },
  {
    name: 'mona - 300',
    description,
    images: [7, 8, 9, 10].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 5,
    variants: [
      { season: 'winter', category: 'children', stock: 3 },
      { season: 'winter', category: 'women', stock: 3 },
    ],
  },
  {
    name: 'mona - 400',
    description,
    images: [11, 12, 13].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'winter', category: 'children', stock: 3 }],
  },
  {
    name: 'mona - 500',
    description,
    images: [16, 17].map((i) => `models/mona/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'winter', category: 'women', stock: 5 }],
  },
  {
    name: 'soha - 100',
    description,
    images: [1, 2].map((i) => `models/soha/${i}.png`),
    price: 400,
    rating: 4.6,
    variants: [{ season: 'winter', category: 'children', stock: 3 }],
  },
  {
    name: 'toqa - 100',
    description,
    images: [5, 6, 7].map((i) => `models/toqa/${i}.png`),
    price: 400,
    rating: 4.3,
    variants: [{ season: 'winter', category: 'children', stock: 3 }],
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
