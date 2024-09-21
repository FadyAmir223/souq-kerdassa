'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { CityCategory } from '@repo/db/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/trpc/react'

const labels = {
  cairoGiza: 'القاهرة و الجيزة',
  alex: 'الاسكندرية',
  deltaCanal: 'محافظات الدلتا',
  redSeaSouth: 'محافظات الجنوب و البحر الاحمر',
} as const

const cityCategoryPriceSchema = z.object({
  categories: z.array(z.coerce.number().positive()),
})

type FormData = z.infer<typeof cityCategoryPriceSchema>

export default function CitiesPricing() {
  const { toast } = useToast()

  const { data: categories, isPending } = api.city.category.all.useQuery(undefined, {
    staleTime: Infinity,
  })

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(cityCategoryPriceSchema),
    defaultValues: { categories: [] },
    values: { categories: categories?.map(({ price }) => price) ?? [] },
  })

  const utils = api.useUtils()

  const updateCategory = api.city.category.update.useMutation({
    onMutate: (newCategories) => ({ newCategories }),
    onSuccess: (_, __, { newCategories }) => {
      toast({
        description: 'تم تغيير الاسعار',
        variant: 'success',
      })

      const updatedCategories = categories?.map((oldCategory) => {
        const updatedCategory = newCategories.find(
          (newCategory) => oldCategory.id === newCategory.id,
        )

        if (updatedCategory) return { ...oldCategory, price: updatedCategory.price }
        return oldCategory
      })

      utils.city.category.all.setData(undefined, updatedCategories)
    },
    onError: ({ message }) => {
      toast({
        description: message,
        variant: 'destructive',
      })
    },
  })

  if (!categories) return null

  const onSubmit = (formData: FormData) => {
    const newCategories = formData.categories
      .map((newPrice, index) =>
        newPrice !== categories[index]?.price
          ? { id: categories[index]?.id, price: newPrice }
          : undefined,
      )
      .filter(Boolean)

    if (newCategories.length === 0) return

    // @ts-expect-error can't catch the filter
    updateCategory.mutate(newCategories)
  }

  return (
    <div>
      <h3 className='mb-4 text-xl font-semibold'>سعر المحافظات</h3>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <ul className='space-y-4 md:space-y-2'>
          {categories.map(({ id, category }, index) => (
            <li key={id} className='flex flex-col gap-2 md:flex-row md:items-center'>
              <Label className='w-32'>{labels[category as CityCategory]}</Label>
              <Input
                type='number'
                min={1}
                {...register(`categories.${index}`)}
                className='ring-1 ring-black/50'
              />
            </li>
          ))}
        </ul>

        <Button
          className='transition-transform active:scale-[0.96]'
          disabled={isPending}
        >
          حفظ
        </Button>
      </form>
    </div>
  )
}
