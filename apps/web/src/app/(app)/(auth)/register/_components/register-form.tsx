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
import { PAGES, PLACEHOLDER, SEARCH_PARAMS } from '@/utils/constants'

const inputs = [
  {
    type: 'text',
    label: 'الاسم بالكامل',
    name: 'name',
    placeholder: PLACEHOLDER.form.name,
    autoComplete: 'off',
  },
  {
    type: 'text',
    label: 'رقم التليفون',
    name: 'phone',
    placeholder: PLACEHOLDER.form.phone,
    autoComplete: 'off',
  },
  {
    type: 'password',
    label: 'كلمة السر',
    name: 'password',
    placeholder: PLACEHOLDER.form.password,
    autoComplete: 'new-password',
  },
  {
    type: 'password',
    label: 'تأكيد كلمة السر',
    name: 'confirmPassword',
    placeholder: PLACEHOLDER.form.password,
    autoComplete: 'new-password',
  },
] as const

export default function RegisterForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerUser = api.auth.register.useMutation({
    onSuccess: () => {
      router.replace(
        searchParams.get(SEARCH_PARAMS.redirectTo) ?? PAGES.defaultLoginRedirect(),
      )

      router.refresh()
    },
    onError: ({ message }) => {
      // error.data?.zodError?.fieldErrors

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

      <Button disabled={registerUser.isPending}>إنشاء حساب</Button>
    </form>
  )
}
