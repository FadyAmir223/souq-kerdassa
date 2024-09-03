import db from '@repo/db'
import type { User } from '@repo/db/types'

export async function getUserByPhone(phone: User['phone']) {
  try {
    return await db.user.findUnique({
      where: { phone },
      select: {
        id: true,
        name: true,
        phone: true,
        password: true,
      },
    })
  } catch {
    return null
  }
}
