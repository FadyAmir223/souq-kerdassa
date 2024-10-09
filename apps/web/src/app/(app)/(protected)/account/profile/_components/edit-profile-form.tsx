'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { EditProfileSchema } from '@repo/validators'
import { editProfileSchema } from '@repo/validators'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'
import { api } from '@/trpc/react'
import { PLACEHOLDER } from '@/utils/constants'

const inputs = [
  {
    type: 'text',
    label: 'الاسم بالكامل',
    name: 'name',
    placeholder: PLACEHOLDER.form.name,
  },
  {
    type: 'text',
    label: 'رقم التليفون',
    name: 'phone',
    placeholder: PLACEHOLDER.form.phone,
  },
] as const

export default function EditProfileForm() {
  const { toast } = useToast()
  const user = useCurrentUser()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone,
    },
  })

  const watchFields = watch()

  const isInitData =
    user?.name === watchFields.name && user.phone === watchFields.phone

  const editProfile = api.user.editProfile.useMutation({
    onSuccess: () => {
      toast({
        variant: 'success',
        description: 'تم تحديث البيانات',
      })
    },
    onError: ({ message }) => {
      toast({
        variant: 'destructive',
        description: message,
      })
    },
  })

  return (
    <form
      onSubmit={handleSubmit((formData) => editProfile.mutate(formData))}
      className='space-y-3'
    >
      {inputs.map(({ name, label, ...props }) => (
        <div key={name}>
          <Label>{label}</Label>
          <Input {...register(name)} {...props} className='border-black' />
          <p className='h-[1.21875rem] text-[0.8rem] font-medium text-destructive'>
            {errors[name]?.message}
          </p>
        </div>
      ))}

      <Button
        disabled={
          watchFields.name === '' ||
          watchFields.phone === '' ||
          isInitData ||
          editProfile.isPending
        }
      >
        تعديل البيانات
      </Button>
    </form>
  )
}
