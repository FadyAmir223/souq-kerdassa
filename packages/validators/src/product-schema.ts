import { z } from 'zod'

export const ProductTypeSchema = z.enum(['SUMMER', 'WINTER', 'LATEST'])
