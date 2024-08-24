import { z } from 'zod'

export const inputSchema = z.object({ task: z.string() })
