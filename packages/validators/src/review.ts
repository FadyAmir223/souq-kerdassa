import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  message: z.string(),
})
export type ReviewSchema = z.infer<typeof reviewSchema>
