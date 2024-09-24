import type { Product } from '@repo/db/types'
import type { AddProductSchema } from '@repo/validators'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import type { MutableRefObject } from 'react'
import { useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IoClose } from 'react-icons/io5'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'
import { ASSETS, SEARCH_PARAMS } from '@/utils/constants'

import { useResponsiveImageSize } from '../../_hooks/use-responsive-image-size'
import type { ImageMeta } from './action-product-form'

function readFile(data: File | Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(data)
  })
}

async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], filename, { type: 'image/webp' })
}

type UploadImagesSectionProps = {
  previousImages?: Product['images']
  imagesMetaRef: MutableRefObject<ImageMeta[]>
}

export default function UploadImagesSection({
  previousImages,
  imagesMetaRef,
}: UploadImagesSectionProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const form = useFormContext<AddProductSchema>()

  const imagesInputs = useFieldArray({
    name: 'images',
    control: form.control,
  })

  const imageSize = useResponsiveImageSize()

  useEffect(() => {
    if (!previousImages) return

    void (async () => {
      const files = await Promise.all(
        previousImages.map(async (imageUrl) => {
          const filename = imageUrl.split('/').pop() ?? ''
          return urlToFile(
            `${ASSETS.images}?${SEARCH_PARAMS.path}=${imageUrl}&${SEARCH_PARAMS.width}=${imageSize}`,
            filename,
          )
        }),
      )

      const images = await Promise.all(files.map((file) => readFile(file!)))
      setImagePreviews(images as string[])

      // @ts-expect-error mixing between browser and node File class?
      form.setValue('images', files)

      imagesMetaRef.current = files.map(({ name, size, lastModified }) => ({
        name,
        size,
        lastModified,
      }))
    })()
  }, [previousImages]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddImageField = () => {
    // @ts-expect-error as File
    imagesInputs.append('')

    setTimeout(() => {
      const selector = `input[name="images.${imagesInputs.fields.length}"]`
      const newFieldInput: HTMLInputElement | null = document.querySelector(selector)
      newFieldInput?.click()
    }, 0)
  }

  const handleRemoveImage = (fieldIndex: number) => {
    imagesInputs.remove(fieldIndex)

    setImagePreviews((prevImagePreviews) =>
      prevImagePreviews.filter((_, index) => index !== fieldIndex),
    )
  }

  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle>صور المنتج</CardTitle>
        <CardDescription>اضف من 1 إلى 4 صور</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-2'>
          <div className='grid gap-2'>
            <div className='grid gap-2 sm:grid-cols-2'>
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
                                onClick={() => handleRemoveImage(fieldIndex)}
                                type='button'
                                aria-label='امسح الصورة'
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
                                  onChange(file)

                                  const newPreviewImage = await readFile(file!)
                                  setImagePreviews((prevImagePreviews) => [
                                    ...prevImagePreviews,
                                    newPreviewImage as string,
                                  ])
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
                  'flex aspect-[83/100] w-full items-center justify-center rounded-md border border-dashed border-black/60 opacity-60',
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
  )
}
