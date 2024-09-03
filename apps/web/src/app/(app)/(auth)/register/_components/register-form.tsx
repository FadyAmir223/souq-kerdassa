'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { RegisterFormSchema } from '@repo/validators'
import { registerFormSchema } from '@repo/validators'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/trpc/react'
import { PLACEHOLDER, ROUTES, SEARCH_PARAMS } from '@/utils/constants'

const inputs = [
  {
    type: 'text',
    label: 'الاسم بالكامل',
    name: 'name',
    placeholder: PLACEHOLDER.name,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'رقم التليفون',
    name: 'phone',
    placeholder: PLACEHOLDER.phone,
    autoComplete: 'off',
  },
  {
    type: 'password',
    label: 'كلمة السر',
    name: 'password',
    placeholder: PLACEHOLDER.password,
    autoComplete: 'new-password',
  },
  {
    type: 'password',
    label: 'تأكيد كلمة السر',
    name: 'confirmPassword',
    placeholder: PLACEHOLDER.password,
    autoComplete: 'new-password',
  },
] as const

export default function RegisterForm() {
  const { toast } = useToast()

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const searchParams = useSearchParams()

  const registerUser = api.auth.register.useMutation({
    onSuccess: () => {
      router.push(
        searchParams.get(SEARCH_PARAMS.redirectTo) ?? ROUTES.defaultLoginRedirect,
      )
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
    <form
      onSubmit={handleSubmit((formData) => registerUser.mutate(formData))}
      className='space-y-3'
    >
      {inputs.map(({ name, label, ...props }) => (
        <div key={name} className=''>
          <Label>{label}</Label>
          <Input {...register(name)} {...props} className='border-black' />
          <p className='h-[1.21875rem] text-[0.8rem] font-medium text-destructive'>
            {errors[name]?.message}
          </p>
        </div>
      ))}

      <Button disabled={isSubmitting}>إنشاء حساب</Button>
    </form>
  )
}
