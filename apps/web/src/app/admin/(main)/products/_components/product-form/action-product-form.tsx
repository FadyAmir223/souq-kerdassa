'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Category, Product, VisibilityStatus } from '@repo/db/types'
import type { AddProductSchema } from '@repo/validators'
import { addProductSchema } from '@repo/validators'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useRef } from 'react'
import { SwatchesPicker } from 'react-color'
import { useForm } from 'react-hook-form'

import SidebarCollapseButton from '@/app/admin/(main)/_components/sidebar-collapse-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'
import { SIZES } from '@/utils/constants'

import { PAGES } from '../../../../_utils/constants'
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
    field: Input,
    type: 'text',
  },
  {
    name: 'description',
    label: 'الوصف',
    field: Textarea,
  },
] as const

const defaultValues = {
  name: '',
  description: '',
  // @ts-expect-error...
  sizes: [],
  // @ts-expect-error...
  colors: [],
  // @ts-expect-error...
  seasons: [],
  images: [],
  visibility: '' as VisibilityStatus,
  variants: [
    {
      price: 0,
      discount: 0,
      category: '' as Category,
    },
  ],
} satisfies AddProductSchema

export type ImageMeta = {
  name: string
  size: number
  lastModified: number
}

type ActionProductFormProps = {
  productId?: Product['id']
}

export default function ActionProductForm({ productId }: ActionProductFormProps) {
  const { data: productDetails, isFetched } = api.product.admin.detailsById.useQuery(
    productId!,
    { enabled: !!productId },
  )

  if (productId && isFetched && !productDetails) notFound()

  const actionType = productId ? 'edit' : 'add'
  const labels = labelsType[actionType]

  const { toast } = useToast()
  const imagesMetaRef = useRef<ImageMeta[]>([])

  const form = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues,
    // @ts-expect-error preview section sets it to File
    values: productDetails
      ? { ...productDetails, images: undefined }
      : defaultValues,
  })

  const utils = api.useUtils()

  const actionProduct = api.product.admin[actionType].useMutation({
    onSuccess: () => {
      if (actionType === 'add') form.reset(defaultValues)

      toast({
        description: labels.message,
        variant: 'success',
      })

      void utils.product.invalidate()
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

    if (actionType === 'add') {
      let uploadRes: Awaited<ReturnType<typeof uploadImages>> | undefined

      if (images.length) {
        const imagesForm = new FormData()
        images.forEach((image, index) => {
          imagesForm.append(`images.${index}`, image as Blob)
        })

        uploadRes = await uploadImages({ formData: imagesForm, action: 'add' })
        if (uploadRes.error)
          return toast({
            description: uploadRes.error,
            variant: 'destructive',
          })
      }

      actionProduct.mutate({
        imagePaths: uploadRes ? uploadRes.imagePaths : undefined,
        ...formData,
      })

      return
    }

    const addedImages = images.filter(
      (newItem) =>
        !imagesMetaRef.current.some(
          (mainItem) =>
            mainItem.size === newItem.size &&
            mainItem.lastModified === newItem.lastModified,
        ),
    )

    const hadImages = productDetails?.images.length

    const projectPath = hadImages
      ? productDetails.images[0]!.substring(
          0,
          productDetails.images[0]!.lastIndexOf('/'),
        )
      : null

    const deletedImages = hadImages
      ? imagesMetaRef.current
          .filter(
            (mainItem) =>
              !images.some(
                (newItem) =>
                  mainItem.size === newItem.size &&
                  mainItem.lastModified === newItem.lastModified,
              ),
          )
          .map((mainItem) => mainItem.name)
      : []

    const imagesForm = new FormData()
    addedImages.forEach((image, index) => {
      imagesForm.append(`images.${index}`, image as Blob)
    })

    let uploadRes: Awaited<ReturnType<typeof uploadImages>> | undefined

    if (addedImages.length > 0 || deletedImages.length > 0) {
      uploadRes = projectPath
        ? await uploadImages({
            formData: imagesForm,
            projectPath,
            deletedImages,
            action: 'edit',
          })
        : await uploadImages({
            formData: imagesForm,
            action: 'add',
          })

      if (uploadRes.error)
        return toast({
          description: uploadRes.error,
          variant: 'destructive',
        })
    }

    const unchangedImages = imagesMetaRef.current
      .filter((mainItem) =>
        images.some(
          (newItem) =>
            mainItem.size === newItem.size &&
            mainItem.lastModified === newItem.lastModified,
        ),
      )
      .map((image) => `${projectPath}/${image.name}`)

    actionProduct.mutate({
      id: productDetails!.id,
      imagePaths: uploadRes
        ? [...unchangedImages, ...uploadRes.imagePaths!]
        : undefined,
      ...formData,
    })
  }

  return (
    <main className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
      <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-semibold md:text-2xl'>{labels.title}</h1>
          <SidebarCollapseButton />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'
          >
            <div className='flex items-center gap-4'>
              <div className='hidden items-center gap-2 md:ml-auto md:flex'>
                <Button size='sm' disabled={actionProduct.isPending}>
                  {labels.save}
                </Button>

                <Button
                  asChild
                  variant='outline'
                  size='sm'
                  disabled={actionProduct.isPending}
                  type='button'
                >
                  <Link href={PAGES.products.root}>تراجع</Link>
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
                        ({ field: Input, name, label, ...inputProps }) => (
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
                                    rows={3}
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

                      <FormField
                        control={form.control}
                        name='sizes'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>الأحجام</FormLabel>
                            <div className='flex flex-wrap gap-x-5 gap-y-2'>
                              {Object.keys(SIZES).map((size) => (
                                <span key={size} className='flex items-center gap-1'>
                                  <FormLabel>{size}</FormLabel>
                                  <Checkbox
                                    className='mb-[0.1875rem]'
                                    id={size}
                                    checked={field.value.includes(size as '1' | '2')}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, size]
                                        : field.value.filter((val) => val !== size)
                                      field.onChange(newValue)
                                    }}
                                  />
                                </span>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='seasons'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>المواسم</FormLabel>
                            <div className='flex flex-wrap gap-x-5 gap-y-2'>
                              {(
                                [
                                  {
                                    label: 'صيفى',
                                    value: 'summer',
                                  },
                                  {
                                    label: 'شتوى',
                                    value: 'winter',
                                  },
                                ] as const
                              ).map(({ label, value }) => (
                                <span
                                  key={value}
                                  className='flex items-center gap-1'
                                >
                                  <FormLabel>{label}</FormLabel>
                                  <Checkbox
                                    className='mb-[0.1875rem]'
                                    id={value}
                                    checked={field.value.includes(value)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, value]
                                        : field.value.filter((val) => val !== value)
                                      field.onChange(newValue)
                                    }}
                                  />
                                </span>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='colors'
                        render={({ field }) => (
                          <FormItem className='grid'>
                            <FormLabel>الألوان</FormLabel>

                            <div className='mt-2 flex flex-wrap gap-2'>
                              {field.value.length ? (
                                field.value.map((color) => (
                                  <Button
                                    key={color}
                                    className={cn('size-8 rounded', {
                                      'border border-black': color === '#ffffff',
                                    })}
                                    style={{
                                      backgroundColor: color,
                                    }}
                                    variant='none'
                                    size='none'
                                    type='button'
                                    onClick={() =>
                                      field.onChange(
                                        field.value.filter((c) => c !== color),
                                      )
                                    }
                                  />
                                ))
                              ) : (
                                <div className='size-8 rounded border bg-gradient-to-bl from-green-500/50 via-blue-500/50 to-red-500/50' />
                              )}
                            </div>

                            <FormControl>
                              <SwatchesPicker
                                onChangeComplete={(color) => {
                                  const newColor = color.hex
                                  const hasColor = field.value.includes(newColor)
                                  const updatedColors = hasColor
                                    ? field.value.filter((c) => c !== newColor)
                                    : [...field.value, newColor]

                                  field.onChange(updatedColors)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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

                <UploadImagesSection
                  imagesMetaRef={imagesMetaRef}
                  previousImages={productDetails?.images}
                />
              </div>
            </div>
            <div className='flex items-center justify-center gap-2 md:hidden'>
              <Button size='sm' disabled={actionProduct.isPending}>
                {labels.save}
              </Button>

              <Button
                asChild
                variant='outline'
                size='sm'
                disabled={actionProduct.isPending}
                type='button'
              >
                <Link href={PAGES.products.root}>تراجع</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}
