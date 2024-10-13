'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { LoginFormSchema } from '@repo/validators'
import { loginFormSchema } from '@repo/validators'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/trpc/react'
import { loginFormInputs, SEARCH_PARAMS } from '@/utils/constants'

import { PAGES } from '../../_utils/constants'

export default function AdminLoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  const loginUser = api.auth.login.useMutation({
    onSuccess: ({ success }) => {
      if (success) router.refresh()

      const redirectTo =
        searchParams.get(SEARCH_PARAMS.redirectTo) ?? PAGES.dashboard
      router.replace(redirectTo, { scroll: !redirectTo })
    },
    onError: ({ message }) => {
      toast({
        variant: 'destructive',
        description: message,
      })
    },
    trpc: {
      context: {
        skipStream: true,
      },
    },
  })

  return (
    <form onSubmit={handleSubmit((formData) => loginUser.mutate(formData))}>
      <CardContent className='grid gap-4'>
        {loginFormInputs.map(({ name, label, ...props }) => (
          <div key={name}>
            <Label>{label}</Label>
            <Input {...register(name)} {...props} className='border-black' />
            <p className='h-[1.21875rem] text-[0.8rem] font-medium text-destructive'>
              {errors[name]?.message}
            </p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className='w-full'>تسجيل الدخول</Button>
      </CardFooter>
    </form>
  )
}
