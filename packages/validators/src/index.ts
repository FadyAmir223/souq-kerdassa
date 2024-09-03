import { z } from 'zod'

export * from './auth'
export * from './product-schema'

export const cuidSchema = z.string().cuid()
export const uuidSchema = z.string().uuid()
