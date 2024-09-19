import type { AdminProductStatusSchema } from '@repo/validators'

export const tabs = [
  { label: 'الكل', value: 'all' },
  { label: 'نشط', value: 'active' },
  { label: 'مخفى', value: 'draft' },
] as const satisfies {
  label: string
  value: AdminProductStatusSchema
}[]
