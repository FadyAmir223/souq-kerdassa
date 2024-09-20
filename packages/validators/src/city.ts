import { z } from 'zod'

export const cityCategorySchema = z.array(
  z.object({ id: z.number().int(), price: z.coerce.number().positive() }),
)
export type CityCategorySchema = z.infer<typeof cityCategorySchema>
