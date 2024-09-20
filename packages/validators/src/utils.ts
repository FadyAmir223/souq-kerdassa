import { z } from 'zod'

export const cuidSchema = z.string().cuid()
export const uuidSchema = z.string().uuid()

export const paginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
})
export type PaginationSchema = z.infer<typeof paginationSchema>
