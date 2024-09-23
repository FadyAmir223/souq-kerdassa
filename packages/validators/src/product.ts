import { z } from 'zod'

import { cuidSchema, paginationSchema } from './utils'

export const productTypeSchema = z.enum(['latest', 'top-rated'])
export type ProductTypeSchema = z.infer<typeof productTypeSchema>

export const productSeasonSchema = z.enum(['summer', 'winter'], {
  message: 'يجب اختيار الموسم: صيفى او شتوى',
})
export type ProductSeasonSchema = z.infer<typeof productSeasonSchema>

export const productCategorySchema = z.enum(['women', 'children'], {
  message: 'يجب اختيار النوع: نساء او اطفال',
})
export type ProductCategorySchema = z.infer<typeof productCategorySchema>

export const productsByFiltersSchema = paginationSchema.extend({
  type: productTypeSchema.optional(),
  season: productSeasonSchema.optional(),
  category: productCategorySchema.optional(),
})
export type ProductsByFiltersSchema = z.infer<typeof productsByFiltersSchema>

export const adminProductStatusSchema = z
  .enum(['all', 'active', 'draft'])
  .default('all')
export type AdminProductStatusSchema = z.infer<typeof adminProductStatusSchema>

export const adminProductsSchema = paginationSchema.extend({
  visibility: adminProductStatusSchema,
})
export type AdminProductsSchema = z.infer<typeof adminProductsSchema>

export const addProductNoImagesSchema = z.object({
  id: cuidSchema.optional(),
  name: z.string().min(1, { message: 'اسم المنتج مطلوب' }),
  description: z.string(),
  price: z.coerce
    .number({ message: 'يجب ان يكون رقم' })
    .int({ message: 'يجب ان يكون رقم صحيح' })
    .positive({ message: 'يجب ان يكون رقم موجب' }),
  variants: z
    .array(
      z.object({
        id: cuidSchema.optional(),
        stock: z.coerce
          .number({ message: 'يجب ان يكون رقم' })
          .int({ message: 'يجب ان يكون رقم صحيح' })
          .min(0, { message: 'اقل رقم 0' }),
        season: productSeasonSchema,
        category: productCategorySchema,
      }),
    )
    .min(1, { message: 'اضف تفريع واحد على الاقل' })
    .max(4, { message: 'اقصى عدد 4 تفريعات' }),
  visibility: z.enum(['active', 'draft'], {
    message: 'يجب اختيار الحالة: نشط او مخفى',
  }),
})

export const addProductImagesSchema = z.object({
  images: z
    .array(
      z
        .instanceof(File, { message: 'الصورة مطلوبة' })
        .refine((file) => file.size > 0, 'الصورة مطلوبة')
        .refine(
          (file) => file.size <= 10 * 1024 * 1024,
          'اكبر حجم للصورة 10 ميجابايت',
        )
        .refine((file) => file.type.startsWith('image/'), 'صيغة صورة غير مدعمة'),
    )
    .min(1, { message: 'اضف صورة واحدة على الاقل' })
    .max(4, { message: 'اقصى عدد 4 صور' }),
})

export const addProductSchema = addProductNoImagesSchema.merge(
  addProductImagesSchema,
)
export type AddProductSchema = z.infer<typeof addProductSchema>

export const addProductImagePathsSchema = addProductNoImagesSchema.extend({
  imagePaths: z.array(z.string()).optional(),
})
export type AddProductImagePathsSchema = z.infer<typeof addProductImagePathsSchema>
