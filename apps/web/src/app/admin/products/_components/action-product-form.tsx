'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Category, Season, VisibilityStatus } from '@repo/db/types'
import type { AddProductSchema } from '@repo/validators'
import { addProductSchema } from '@repo/validators'
import { PlusCircle, Upload } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { FaTrashCan } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'

import { PAGES } from '../../_utils/constants'
import { uploadImages } from '../_actions/upload-images'

function readFile(data: File | Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(data)
  })
}

export default function ActionProductForm() {
  const { toast } = useToast()
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const form = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      variants: [
        {
          stock: undefined,
          season: '' as Season,
          category: '' as Category,
        },
      ],
      visibility: '' as VisibilityStatus,
      images: [],
    },
  })

  const variantsInputs = useFieldArray({
    name: 'variants',
    control: form.control,
  })

  const imagesInputs = useFieldArray({
    name: 'images',
    control: form.control,
  })

  const addProduct = api.product.admin.add.useMutation({
    onSuccess: () => {
      toast({
        description: 'تم إضافة المنتج بنجاح',
        variant: 'success',
      })
      form.reset()
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

    addProduct.mutate({
      imagePaths: uploadRes.imagePaths!,
      ...formData,
    })
  }

  const handleAddImageField = () => {
    // @ts-expect-error as File
    imagesInputs.append(new File([' '], ''))

    // open the new input after mount
    setTimeout(() => {
      const selector = `input[name="images.${imagesInputs.fields.length}"]`
      const newFieldInput: HTMLInputElement | null = document.querySelector(selector)
      newFieldInput?.click()
    }, 0)
  }

  return (
    <main className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
      <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
        <h1 className='text-lg font-semibold md:text-2xl'>اضف منتج</h1>
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
                  disabled={addProduct.isPending}
                  type='button'
                >
                  <Link href={PAGES.products.root}>تراجع</Link>
                </Button>
                <Button size='sm' disabled={addProduct.isPending}>
                  احفظ المنتج
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
                      {(
                        [
                          { name: 'name', label: 'الاسم', type: 'text' },
                          { name: 'description', label: 'الوصف', type: 'text' },
                          { name: 'price', label: 'السعر', type: 'number', min: 1 },
                        ] as const
                      ).map(({ name, label, ...inputProps }) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>المخزن</CardTitle>
                    <CardDescription>اضف نوع و موسم و عدد كل تفريع</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>العدد</TableHead>
                          <TableHead>الموسم</TableHead>
                          <TableHead>النوع</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {variantsInputs.fields.map((field, fieldIndex) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`variants.${fieldIndex}.stock`}
                                render={({ field }) => (
                                  <FormItem className='grid'>
                                    <FormControl>
                                      <Input
                                        type='number'
                                        min={0}
                                        {...field}
                                        className='w-full'
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>

                            {(
                              [
                                {
                                  label: 'الموسم',
                                  value: 'season',
                                  options: [
                                    {
                                      label: 'صيفى',
                                      value: 'summer',
                                    },
                                    {
                                      label: 'شتوى',
                                      value: 'winter',
                                    },
                                  ],
                                },
                                {
                                  label: 'النوع',
                                  value: 'category',
                                  options: [
                                    {
                                      label: 'نساء',
                                      value: 'women',
                                    },
                                    {
                                      label: 'اطفال',
                                      value: 'children',
                                    },
                                  ],
                                },
                              ] as const
                            ).map((variant) => (
                              <TableCell key={variant.value}>
                                <FormField
                                  control={form.control}
                                  name={`variants.${fieldIndex}.${variant.value}`}
                                  render={({ field }) => (
                                    <FormItem className='grid'>
                                      <FormLabel className='sr-only'>
                                        {variant.label}
                                      </FormLabel>
                                      <FormControl>
                                        <ToggleGroup
                                          ref={field.ref}
                                          value={field.value}
                                          onValueChange={field.onChange}
                                          onBlur={field.onBlur}
                                          disabled={field.disabled}
                                          type='single'
                                          variant='outline'
                                        >
                                          {variant.options.map((option) => (
                                            <ToggleGroupItem
                                              key={option.value}
                                              value={option.value}
                                              size='sm'
                                            >
                                              {option.label}
                                            </ToggleGroupItem>
                                          ))}
                                        </ToggleGroup>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            ))}

                            <TableCell>
                              <Button
                                size='icon'
                                variant='none'
                                onClick={() => variantsInputs.remove(fieldIndex)}
                                type='button'
                                disabled={variantsInputs.fields.length === 1}
                              >
                                <FaTrashCan className='text-destructive' size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>

                  <CardFooter className='justify-center border-t p-4'>
                    <Button
                      size='sm'
                      variant='ghost'
                      className={cn('gap-1', {
                        hidden: variantsInputs.fields.length === 4,
                      })}
                      type='button'
                      onClick={() =>
                        variantsInputs.append({
                          stock: 0,
                          season: '' as Season,
                          category: '' as Category,
                        })
                      }
                    >
                      <PlusCircle className='size-3.5' />
                      اضف تفريع
                    </Button>
                  </CardFooter>
                </Card>
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

                <Card className='overflow-hidden'>
                  <CardHeader>
                    <CardTitle>صور المنتج</CardTitle>
                    <CardDescription>اضف من 1 إلى 4 صور</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid gap-2'>
                      <div className='grid gap-2'>
                        <div className='grid grid-cols-2 gap-2'>
                          {imagesInputs.fields.map((field, fieldIndex) => (
                            <FormField
                              key={field.id}
                              control={form.control}
                              name={`images.${fieldIndex}`}
                              render={({
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
                                field: { value, onChange, ...fieldProps },
                              }) => {
                                const hasError =
                                  form.formState.errors.images?.[fieldIndex]?.message

                                return (
                                  <FormItem>
                                    <FormControl>
                                      {imagePreviews[fieldIndex] ? (
                                        <div className='relative aspect-[83/100] overflow-hidden rounded-md'>
                                          <Image
                                            src={imagePreviews[fieldIndex]}
                                            alt='بروفة'
                                            fill
                                            className='object-cover'
                                          />
                                          <button
                                            className='absolute left-4 top-4 grid size-6 place-items-center rounded-full bg-black text-white lg:left-2 lg:top-2 lg:size-4'
                                            onClick={() => {
                                              imagesInputs.remove(fieldIndex)
                                              setImagePreviews((prevImagePreviews) =>
                                                prevImagePreviews.splice(
                                                  fieldIndex,
                                                  1,
                                                ),
                                              )
                                            }}
                                            type='button'
                                          >
                                            <IoClose className='size-4 lg:size-3' />
                                          </button>
                                        </div>
                                      ) : (
                                        <label
                                          className={cn(
                                            'flex aspect-[83/100] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-black/60',
                                            {
                                              'border-destructive': hasError,
                                            },
                                          )}
                                        >
                                          <Input
                                            type='file'
                                            {...fieldProps}
                                            className='hidden'
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0]
                                              const newPreviewImage =
                                                (await readFile(file!)) as string

                                              onChange(file)
                                              setImagePreviews(
                                                (prevImagePreviews) => [
                                                  ...prevImagePreviews,
                                                  newPreviewImage,
                                                ],
                                              )
                                            }}
                                          />

                                          <Upload
                                            className={cn(
                                              'size-6 text-muted-foreground lg:size-4',
                                              { 'text-destructive': hasError },
                                            )}
                                          />
                                          <span className='sr-only'>رفع الصورة</span>
                                        </label>
                                      )}
                                    </FormControl>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}

                          <button
                            className={cn(
                              'flex aspect-[83/100] w-full items-center justify-center rounded-md border border-dashed border-black/60',
                              { hidden: imagesInputs.fields.length === 4 },
                            )}
                            onClick={handleAddImageField}
                            type='button'
                          >
                            <Upload className='size-6 text-muted-foreground lg:size-4' />
                            <span className='sr-only'>اضف صورة اخرى</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className='flex items-center justify-center gap-2 md:hidden'>
              <Button
                asChild
                variant='outline'
                size='sm'
                disabled={addProduct.isPending}
                type='button'
              >
                <Link href={PAGES.products.root}>تراجع</Link>
              </Button>

              <Button size='sm' disabled={addProduct.isPending}>
                احفظ المنتج
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}
