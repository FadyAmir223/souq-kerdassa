import { signIn } from '@repo/auth'
import type { LoginFormSchema } from '@repo/validators'
import { TRPCError } from '@trpc/server'
import { AuthError } from 'next-auth'

export async function credentialSignIn({ phone, password }: LoginFormSchema) {
  try {
    await signIn('credentials', {
      phone,
      password,
      redirect: false,
    })
  } catch (error) {
    // ? why this is falsy if exported from '@repo/auth despite being the same class?
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin')
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'رقم تليفون او كلمة سر خطأ',
        })

      // tRPC: redirection on the client
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'تعذر تسجيل الدخول',
      })
    }

    throw error
  }
}