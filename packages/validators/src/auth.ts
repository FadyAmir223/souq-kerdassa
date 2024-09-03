import { z } from 'zod'

const isProduction = process.env.NODE_ENV === 'production'

export const loginFormSchema = z.object({
  phone: isProduction
    ? z
        .string()
        .min(1, { message: 'رقم التليفون مطلوب' })
        .min(8, { message: 'حد ادنى 8 احرف' })
    : z.string().min(1, { message: 'رقم التليفون مطلوب' }),
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
    name: isProduction
      ? z
          .string()
          .min(1, { message: 'الإسم مطلوب' })
          .min(4, { message: 'حد ادنى 4 احرف' })
      : z.string().min(1, { message: 'الإسم مطلوب' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة سر غير متطابقة',
    path: ['confirmPassword'],
  })

export type RegisterFormSchema = z.infer<typeof registerFormSchema>
