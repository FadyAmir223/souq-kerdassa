'use client'

import type { Category } from '@repo/db/types'
import type { AddProductSchema } from '@repo/validators'
import { PlusCircle } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { FaTrashCan } from 'react-icons/fa6'

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/utils/cn'

const variantsDetailsFields = [
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

export default function VariantsStoreSection() {
  const form = useFormContext<AddProductSchema>()

  const variantsInputs = useFieldArray({
    name: 'variants',
    control: form.control,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>المخزن</CardTitle>
        <CardDescription>اضف السعر و سعر بعد الخصم و نوع كل تفريع</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>السعر</TableHead>
              <TableHead>الخصم</TableHead>
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
                    name={`variants.${fieldIndex}.price`}
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

                <TableCell>
                  <FormField
                    control={form.control}
                    name={`variants.${fieldIndex}.discount`}
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

                {variantsDetailsFields.map((variant) => (
                  <TableCell key={variant.value}>
                    <FormField
                      control={form.control}
                      name={`variants.${fieldIndex}.${variant.value}`}
                      render={({ field }) => (
                        <FormItem className='grid'>
                          <FormLabel className='sr-only'>{variant.label}</FormLabel>
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
                    aria-label='امسح التفريعة'
                  >
                    <FaTrashCan className='text-destructive' size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter
        className={cn('justify-center border-t p-4', {
          hidden: variantsInputs.fields.length === 2,
        })}
      >
        <Button
          size='sm'
          variant='ghost'
          className='gap-1'
          type='button'
          onClick={() =>
            variantsInputs.append({
              price: 0,
              discount: 0,
              category: '' as Category,
            })
          }
        >
          <PlusCircle className='size-3.5' />
          اضف تفريع
        </Button>
      </CardFooter>
    </Card>
  )
}
