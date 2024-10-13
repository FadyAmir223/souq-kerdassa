import { signIn } from '@repo/auth'
import type { LoginFormSchema } from '@repo/validators'
import { TRPCError } from '@trpc/server'
import { AuthError } from 'next-auth'

export async function credentialsSignIn({ phone, password }: LoginFormSchema) {
  try {
    await signIn('credentials', {
      phone,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin')
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'رقم تليفون او كلمة سر غير صحيحة',
        })

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'تعذر تسجيل الدخول',
      })
    }

    // tRPC: redirection on the client
    // throw error
  }
}
