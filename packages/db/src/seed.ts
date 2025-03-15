import type {
  City,
  CityCategoryPrice,
  Product,
  ProductVariant,
} from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { env } from './env.js'

const db = new PrismaClient()

const assetsPath =
  env.NODE_ENV === 'production' ? '/app/apps/web/uploads' : 'uploads'

const description =
  'تحتوي عبايتنا صيفيه على تفاصيل رائعة مثل التطريزات والزخارف الفاخرة، والتي تضفي على العباية لمسة رائعة من الجمال والأناقة لتحصلي على إطلالة متألقة وأنيقة في المناسبات والحفلات'

const sizes = ['1', '2']

const PRODUCTS = [
  {
    name: 'mona - 1',
    description,
    images: [1, 2, 3].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 3,
    seasons: ['summer', 'winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [
      { price: 400, category: 'women' },
      { price: 400, category: 'children' },
    ],
  },
  {
    name: 'soha - 1',
    description,
    images: [1, 2].map((i) => `${assetsPath}/models/soha/${i}.png`),
    rating: 4.6,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [
      { price: 400, discount: 300, category: 'women' },
      { price: 400, discount: 300, category: 'children' },
    ],
  },
  {
    name: 'toqa - 1',
    description,
    images: [5, 6, 7].map((i) => `${assetsPath}/models/toqa/${i}.png`),
    rating: 4.3,
    seasons: ['summer', 'winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [
      { price: 400, discount: 300, category: 'women' },
      { price: 400, discount: 300, category: 'children' },
    ],
  },
  {
    name: 'mona - 2',
    description,
    images: [4, 5].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 3.3,
    seasons: ['summer', 'winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [
      { price: 400, category: 'children' },
      { price: 500, discount: 300, category: 'women' },
    ],
  },
  {
    name: 'mona - 3',
    description,
    images: [7, 8, 9, 10].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 5,
    seasons: ['summer', 'winter'],
    variants: [
      { price: 700, discount: 500, category: 'children' },
      { price: 400, category: 'women' },
    ],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
  },
  {
    name: 'mona - 4',
    description,
    images: [11, 12, 13].map((i) => `${assetsPath}/models/mona/${i}.png`),
    seasons: ['summer', 'winter'],
    rating: 4.3,
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, category: 'children' }],
  },
  {
    name: 'mona - 5',
    description,
    images: [16, 17].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 4.3,
    seasons: ['summer'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'women' }],
  },
  {
    name: 'mona - 10',
    description,
    images: [1, 2, 3].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 3,
    sizes,
    seasons: ['summer'],
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'women' }],
  },
  {
    name: 'mona - 20',
    description,
    images: [4, 5].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 3.3,
    seasons: ['summer'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'children' }],
  },
  {
    name: 'mona - 30',
    description,
    images: [7, 8, 9, 10].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 5,
    seasons: ['summer'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'women' }],
  },
  {
    name: 'mona - 40',
    description,
    images: [11, 12, 13].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 4.3,
    seasons: ['summer'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, category: 'children' }],
  },
  {
    name: 'mona - 50',
    description,
    images: [16, 17].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 4.3,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, category: 'women' }],
  },
  {
    name: 'soha - 10',
    description,
    images: [1, 2].map((i) => `${assetsPath}/models/soha/${i}.png`),
    rating: 4.6,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, category: 'women' }],
  },
  {
    name: 'toqa - 10',
    description,
    images: [5, 6, 7].map((i) => `${assetsPath}/models/toqa/${i}.png`),
    rating: 4.3,
    seasons: ['summer'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'women' }],
  },
  {
    name: 'mona - 100',
    description,
    images: [1, 2, 3].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 3,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'children' }],
  },
  {
    name: 'mona - 200',
    description,
    images: [4, 5].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 3.3,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [
      { price: 400, discount: 300, category: 'children' },
      { price: 400, discount: 300, category: 'women' },
    ],
  },
  {
    name: 'mona - 300',
    description,
    images: [7, 8, 9, 10].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 5,
    seasons: ['summer', 'winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [
      { price: 400, discount: 300, category: 'children' },
      { price: 400, category: 'women' },
    ],
  },
  {
    name: 'mona - 400',
    description,
    images: [11, 12, 13].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 4.3,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, category: 'children' }],
  },
  {
    name: 'mona - 500',
    description,
    images: [16, 17].map((i) => `${assetsPath}/models/mona/${i}.png`),
    rating: 4.3,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, category: 'women' }],
  },
  {
    name: 'soha - 100',
    description,
    images: [1, 2].map((i) => `${assetsPath}/models/soha/${i}.png`),
    rating: 4.6,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'children' }],
  },
  {
    name: 'toqa - 100',
    description,
    images: [5, 6, 7].map((i) => `${assetsPath}/models/toqa/${i}.png`),
    rating: 4.3,
    seasons: ['winter'],
    sizes,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#0f0f0f'],
    variants: [{ price: 400, discount: 300, category: 'children' }],
  },
] as const satisfies Partial<Product & { variants: Partial<ProductVariant>[] }>[]

const CITY_CATEGORIES = [
  {
    category: 'cairoGiza',
    price: 40,
    cities: [
      { name: 'القاهرة', order: 1 },
      { name: 'الجيزة', order: 2 },
    ],
  },
  {
    category: 'alex',
    price: 45,
    cities: [{ name: 'الإسكندرية', order: 3 }],
  },
  {
    category: 'deltaCanal',
    price: 65,
    cities: [
      { name: 'الشرقية', order: 4 },
      { name: 'الدقهلية', order: 5 },
      { name: 'البحيرة', order: 6 },
      { name: 'الغربية', order: 7 },
      { name: 'القليوبية', order: 8 },
      { name: 'المنوفية', order: 9 },
      { name: 'كفر الشيخ', order: 10 },
      { name: 'دمياط', order: 11 },
      { name: 'الإسماعيلية', order: 12 },
      { name: 'بورسعيد', order: 13 },
      { name: 'السويس', order: 14 },
    ],
  },
  {
    category: 'redSeaSouth',
    price: 70,
    cities: [
      { name: 'الفيوم', order: 15 },
      { name: 'المنيا', order: 16 },
      { name: 'أسيوط', order: 17 },
      { name: 'سوهاج', order: 18 },
      { name: 'بني سويف', order: 19 },
      { name: 'قنا', order: 20 },
      { name: 'أسوان', order: 21 },
      { name: 'الأقصر', order: 22 },
      { name: 'البحر الأحمر', order: 23 },
      { name: 'مطروح', order: 24 },
      { name: 'جنوب سيناء', order: 25 },
      { name: 'شمال سيناء', order: 26 },
      { name: 'الوادي الجديد', order: 27 },
    ],
  },
] as const satisfies Partial<
  CityCategoryPrice & {
    cities: {
      name: City['name']
      order: number
    }[]
  }
>[]

async function main() {
  await db.user.upsert({
    where: {
      phone: env.ADMIN_USERNAME,
    },
    update: {},
    create: {
      name: 'admin',
      phone: env.ADMIN_USERNAME,
      password: env.ADMIN_PASSWORD,
      role: 'ADMIN',
    },
  })

  await db.$transaction(
    CITY_CATEGORIES.map(({ category, price, cities }) =>
      db.cityCategoryPrice.upsert({
        where: {
          category,
        },
        update: {},
        create: {
          category,
          price,
          cities: {
            connectOrCreate: cities.map(({ name, order }) => ({
              where: {
                name,
              },
              create: {
                name,
                order,
              },
            })),
          },
        },
        select: {
          id: true,
        },
      }),
    ),
  )

  // @ts-expect-error ...
  if (env.NODE_ENV === 'production') PRODUCTS.length = 3

  await db.$transaction(
    PRODUCTS.map(({ variants, ...product }) =>
      db.product.upsert({
        where: {
          name: product.name,
        },
        update: {},
        create: {
          ...product,
          visibility: 'active',
          variants: {
            createMany: {
              data: variants,
            },
          },
        },
        select: {
          id: true,
        },
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
