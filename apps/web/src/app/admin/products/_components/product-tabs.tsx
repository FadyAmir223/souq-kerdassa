'use client'

import type { AdminProductStatusSchema } from '@repo/validators'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/trpc/react'

import AdminProductsPagination from './admin-products-pagination'
import ProductItem from './product-item'

/**
 * TODO:
 * pagination
 * delete
 * toggle status
 */

type ProductTabsProps = {
  defaultTab: AdminProductStatusSchema
}

export const tabs = [
  { label: 'الكل', value: 'all' },
  { label: 'نشط', value: 'active' },
  { label: 'مخفى', value: 'draft' },
] as const satisfies {
  label: string
  value: AdminProductStatusSchema
}[]

export default function ProductTabs({ defaultTab }: ProductTabsProps) {
  const [currPage, setCurrPage] = useState(1)
  const [activeTab, setActiveTab] = useState<AdminProductStatusSchema>(defaultTab)

  const [totalProducts] = api.product.admin.count.useSuspenseQuery(activeTab, {
    staleTime: Infinity,
  })

  const [products] = api.product.admin.all.useSuspenseQuery(
    {
      limit: 10,
      page: currPage,
      visibility: activeTab,
    },
    {
      staleTime: 60 * 1000,
    },
  )

  const utils = api.useUtils()

  if (utils.product.admin.count.getData('all') === 0)
    return (
      <main className='flex flex-1 flex-col'>
        <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed border-black p-4 shadow-sm lg:p-6'>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h3 className='text-2xl font-bold tracking-tight'>ليس عندك اى منتجات</h3>
            <p className='text-sm text-muted-foreground'>
              تستطيع ان تبدأ البيع بمجرد ان تضيف منتج
            </p>
            <Button className='mt-4'>اضف منتج</Button>
          </div>
        </div>
      </main>
    )

  const handleTabChange = (value: string) => {
    setActiveTab(value as AdminProductStatusSchema)
    setCurrPage(1)
  }

  return (
    <Tabs defaultValue='all' onValueChange={handleTabChange}>
      <div dir='rtl' className='flex items-center'>
        <TabsList>
          {tabs.map(({ label, value }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className='ms-auto flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuContent align='start'>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size='sm' className='h-7 gap-1'>
            <PlusCircle className='size-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Add Product
            </span>
          </Button>
        </div>
      </div>

      {tabs.map(({ value }) => (
        <TabsContent key={value} dir='rtl' value={value}>
          <Card>
            <CardHeader>
              <CardTitle className='text-start'>كل المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='hidden w-[100px] sm:table-cell'>
                      <span className='sr-only'>الصورة</span>
                    </TableHead>
                    <TableHead>الإسم</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead className='hidden md:table-cell'>المبيعات</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      تم الإنشاء
                    </TableHead>
                    <TableHead>
                      <span className='sr-only'>الافعال</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      currPage={currPage}
                      setCurrPage={setCurrPage}
                      activeTab={activeTab}
                      totalProducts={totalProducts}
                      index={index}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <AdminProductsPagination
              currPage={currPage}
              setCurrPage={setCurrPage}
              totalProducts={totalProducts}
            />

            <CardFooter>
              <div className='text-xs text-muted-foreground'>
                يعرض{' '}
                <strong>
                  {(currPage - 1) * 10 + 1}-{Math.min(currPage * 10, totalProducts)}
                </strong>{' '}
                من <strong>{totalProducts}</strong> منتج
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
