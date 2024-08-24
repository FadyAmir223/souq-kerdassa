// import type { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// const DEFAULT_USERS = [
//   { email: 'fady@gmail.com' },
//   { email: 'jessy@gmail.com' },
// ] satisfies Partial<User>[]

async function main() {
  await Promise.all(
    [].map((user) =>
      db.user.upsert({
        where: { email: '' /* user.email */ },
        update: {},
        create: user,
      }),
    ),
  )
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    // @ts-expect-error FIXME
    // eslint-disable-next-line no-console
    console.error(e)
    await db.$disconnect()
    // @ts-expect-error process exists
    process.exit(1)
  })
