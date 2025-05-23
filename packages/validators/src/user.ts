import { z } from 'zod'

import { cuidSchema } from './utils'

const isProduction = process.env.NODE_ENV === 'production'

const phoneField = {
  phone: isProduction
    ? z
        .string()
        .trim()
        .min(1, { message: 'رقم التليفون مطلوب' })
        .length(11, { message: 'يجب ان يكون 11 رقم' })
        .regex(/^01[0125][0-9]{8}$/, { message: 'رقم تليفون غير صالح' })
    : z.string().trim().min(1, { message: 'رقم التليفون مطلوب' }),
}

const nameField = {
  name: isProduction
    ? z
        .string()
        .trim()
        .min(1, { message: 'الإسم مطلوب' })
        .min(4, { message: 'حد ادنى 4 احرف' })
    : z.string().min(1, { message: 'الإسم مطلوب' }),
}

export const loginFormSchema = z.object({
  ...phoneField,
  password: isProduction
    ? z
        .string()
        .min(1, { message: 'كلمة السر مطلوبة' })
        .min(8, { message: 'حد ادنى 8 احرف' })
        .refine((value) => Buffer.from(value).length <= 72, {
          message: 'كلمة سر طويلة جداً',
        })
    : z.string().min(1, { message: 'كلمة السر مطلوبة' }),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>

export const registerFormSchema = loginFormSchema
  .extend({
    ...nameField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة سر غير متطابقة',
    path: ['confirmPassword'],
  })

export type RegisterFormSchema = z.infer<typeof registerFormSchema>

export const editProfileSchema = z.object({
  ...nameField,
  ...phoneField,
})

export type EditProfileSchema = z.infer<typeof editProfileSchema>

export const addressSchema = z.object({
  cityId: z.number().min(0),
  region: z.string().trim().min(1, { message: 'المنطقة مطلوبة' }),
  street: z.string().trim().min(1, { message: 'الشارع مطلوب' }),
  building: z.string().trim().min(1, { message: 'المبنى مطلوب' }),
  mark: z.string().trim().nullable(),
})

export type AddressSchema = z.infer<typeof addressSchema>

export const addressSchemaWithId = addressSchema.extend({
  id: cuidSchema,
})

export type AddressSchemaWithId = z.infer<typeof addressSchemaWithId>
