import { z } from 'zod'

import { cuidSchema, paginationSchema } from './utils'

const productTypeSchema = z.enum(['latest', 'top-rated'])

export const productSizeSchema = z.enum(['1', '2'], {
  message: 'يجب اختيار الحجم: 1 او 2',
})

export const productSeasonSchema = z.enum(['summer', 'winter'], {
  message: 'يجب اختيار الموسم: صيفى او شتوى',
})

const productCategorySchema = z.enum(['women', 'children'], {
  message: 'يجب اختيار النوع: نساء او اطفال',
})

export const productsByFiltersSchema = paginationSchema.extend({
  type: productTypeSchema.optional(),
  category: productCategorySchema.optional(),
  cursor: z.string().optional(),
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

export const colorSchema = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)

export const addProductNoImagesSchema = z.object({
  id: cuidSchema.optional(),
  name: z.string().trim().min(1, { message: 'اسم المنتج مطلوب' }),
  description: z.string().trim(),
  sizes: z
    .array(z.enum(['1', '2']))
    .nonempty({ message: 'يجب ان تختار حجم واحد على الاقل' }),
  colors: z
    .array(colorSchema)
    .nonempty({ message: 'يجب ان تختار لون واحد على الاقل' }),
  seasons: z
    .array(productSeasonSchema)
    .nonempty({ message: 'يجب ان تختار موسم واحد على الاقل' }),
  visibility: z.enum(['active', 'draft'], {
    message: 'يجب اختيار الحالة: نشط او مخفى',
  }),
  variants: z
    .array(
      z
        .object({
          id: cuidSchema.optional(),
          price: z.coerce
            .number({ message: 'يجب ان يكون رقم' })
            .int({ message: 'يجب ان يكون رقم صحيح' })
            .positive({ message: 'يجب ان يكون رقم موجب' }),
          discount: z.coerce
            .number({ message: 'يجب ان يكون رقم' })
            .int({ message: 'يجب ان يكون رقم صحيح' })
            .optional(),
          category: productCategorySchema,
        })
        .refine(({ price, discount }) => (discount ?? 0) < price, {
          message: 'الخصم اكثر من السعر',
          path: ['discount'],
        }),
    )
    .min(1, { message: 'اضف تفريع واحد على الاقل' })
    .max(2, { message: 'اقصى عدد 2 تفريعات' }),
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
    .max(4, { message: 'اقصى عدد 4 صور' }),
})

export const addProductSchema = addProductNoImagesSchema.merge(
  addProductImagesSchema,
)
export type AddProductSchema = z.infer<typeof addProductSchema>

export const addProductImagePathsSchema = addProductNoImagesSchema.extend({
  imagePaths: z.array(z.string().trim()).optional(),
})
export type AddProductImagePathsSchema = z.infer<typeof addProductImagePathsSchema>
