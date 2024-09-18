'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Category, Season, VisibilityStatus } from '@repo/db/types'
import type { AddProductSchema } from '@repo/validators'
import { addProductSchema } from '@repo/validators'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { defaultProductsQueryParams } from '@/app/admin/_utils/query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import type { RouterOutputs } from '@/trpc/react'
import { api } from '@/trpc/react'

import { PAGES } from '../../../_utils/constants'
import { uploadImages } from '../../_actions/upload-images'
import UploadImagesSection from './upload-images-section'
import VariantsStoreSection from './variants-store-section'

const labelsType = {
  add: {
    title: 'اضافة منتج',
    save: 'احفظ المنتج',
    message: 'تم إضافة المنتج بنجاح',
  },
  edit: {
    title: 'تعديل منتج',
    save: 'احفظ التعديل',
    message: 'تم تعديل المنتج بنجاح',
  },
} as const

const productDetailsFields = [
  {
    name: 'name',
    label: 'الاسم',
    fezza: Input,
    type: 'text',
  },
  {
    name: 'description',
    label: 'الوصف',
    fezza: Textarea,
  },
  {
    name: 'price',
    label: 'السعر',
    fezza: Input,
    type: 'number',
    min: 1,
  },
] as const

const defaultValues = {
  name: '',
  description: '',
  price: 1,
  images: [],
  visibility: '' as VisibilityStatus,
  variants: [
    {
      stock: 0,
      season: '' as Season,
      category: '' as Category,
    },
  ],
}

type ActionProductFormProps = {
  productDetails?: RouterOutputs['product']['admin']['detailsById']
}

export default function ActionProductForm({
  productDetails,
}: ActionProductFormProps) {
  const actionType = productDetails ? 'edit' : 'add'
  const labels = labelsType[actionType]

  const { toast } = useToast()

  const form = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: productDetails ? productDetails : defaultValues,
  })

  const utils = api.useUtils()

  const actionProduct = api.product.admin[actionType].useMutation({
    onSuccess: () => {
      form.reset(defaultValues)

      toast({
        description: labels.message,
        variant: 'success',
      })

      void utils.product.admin.all.invalidate(defaultProductsQueryParams)
    },
    onError: ({ message }) => {
      toast({
        description: message,
        variant: 'destructive',
      })
    },
  })

  /**
   * since we are not using s3, the better approach is to save the db then save the images so we don't end up with orphan images
   * but I may consider s3 in the future
   * I wouldn't like to make major changes then
   */
  const onSubmit = async (_formData: AddProductSchema) => {
    const { images, ...formData } = _formData

    const form = new FormData()
    images.forEach((image, index) => {
      form.append(`images.${index}`, image as Blob)
    })

    const uploadRes = await uploadImages(form)
    if (uploadRes.error)
      return toast({
        description: uploadRes.error,
        variant: 'destructive',
      })

    actionProduct.mutate({
      // @ts-expect-error ts can't know when id is required
      id: actionType === 'edit' ? productDetails.id : undefined,
      imagePaths: uploadRes.imagePaths!,
      ...formData,
    })
  }

  return (
    <main className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
      <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <h1 className='text-lg font-semibold md:text-2xl'>{labels.title}</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'
          >
            <div className='flex items-center gap-4'>
              <div className='hidden items-center gap-2 md:ml-auto md:flex'>
                <Button
                  asChild
                  variant='outline'
                  size='sm'
                  disabled={actionProduct.isPending}
                  type='button'
                >
                  <Link href={PAGES.products.root}>تراجع</Link>
                </Button>
                <Button size='sm' disabled={actionProduct.isPending}>
                  {labels.save}
                </Button>
              </div>
            </div>
            <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
              <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل المنتج</CardTitle>
                    <CardDescription>اضف اسم و وصف يعبر عن المنتج</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-6'>
                      {productDetailsFields.map(
                        ({ fezza: Input, name, label, ...inputProps }) => (
                          <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem className='grid'>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                  <Input
                                    {...inputProps}
                                    {...field}
                                    className='w-full'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <VariantsStoreSection />
              </div>

              <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
                <Card>
                  <CardHeader>
                    <CardTitle>حالة المنتج</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-6'>
                      <div className='grid gap-3'>
                        <FormField
                          control={form.control}
                          name='visibility'
                          render={({
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
                            field: { value, onChange, ref, ...fieldProps },
                          }) => (
                            <FormItem className='grid'>
                              <FormLabel>الحالة</FormLabel>
                              <FormControl>
                                <Select
                                  {...fieldProps}
                                  value={value}
                                  onValueChange={onChange}
                                >
                                  <SelectTrigger id='status' aria-label='اختر حالة'>
                                    <SelectValue placeholder='اختر حالة' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='active'>نشط</SelectItem>
                                    <SelectItem value='draft'>مخفى</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <UploadImagesSection previousImages={productDetails?.images} />
              </div>
            </div>
            <div className='flex items-center justify-center gap-2 md:hidden'>
              <Button
                asChild
                variant='outline'
                size='sm'
                disabled={actionProduct.isPending}
                type='button'
              >
                <Link href={PAGES.products.root}>تراجع</Link>
              </Button>

              <Button size='sm' disabled={actionProduct.isPending}>
                {labels.save}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}
