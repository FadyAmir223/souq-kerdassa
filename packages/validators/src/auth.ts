import { z } from 'zod'

const isProduction = process.env.NODE_ENV === 'production'

export const registerFormSchema = z
  .object({
    name: z.string().min(1),
    phone: z.string().min(isProduction ? 8 : 1, { message: 'رقم التليفون مطلوب' }),
    password: isProduction
      ? z
          .string()
          .min(1, { message: 'كلمة السر مطلوبة' })
          .min(8, { message: 'حد ادنى 8 حروف' })
      : z.string().min(1, { message: 'كلمة السر مطلوبة' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمة سر غير متطابقة',
    path: ['confirmPassword'],
  })
export type RegisterFormSchema = z.infer<typeof registerFormSchema>

export const loginFormSchema = z.object({
  phone: z.string().min(isProduction ? 8 : 1, { message: 'رقم التليفون مطلوب' }),
  password: z.string().min(1, { message: 'كلمة السر مطلوبة' }),
})
export type LoginFormSchema = z.infer<typeof loginFormSchema>

export const loginFormSchemaWithRedirect = loginFormSchema.extend({
  redirectTo: z.string().nullable().optional(),
})
export type LoginFormSchemaWithRedirect = z.infer<typeof loginFormSchemaWithRedirect>
