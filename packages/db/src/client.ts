import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => new PrismaClient()

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const db = globalForPrisma.prisma ?? prismaClientSingleton()

export default db

// @ts-expect-error process exists
// eslint-disable-next-line no-restricted-properties
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
