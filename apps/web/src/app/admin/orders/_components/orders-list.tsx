'use client'

import type { Order } from '@repo/db/types'
import type { AdminOrderStatusSchema } from '@repo/validators'
import { ListFilter } from 'lucide-react'
import { Suspense, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import Spinner from '../../_components/spinner'
import { orderFilterOptions } from '../_utils/order-filter-opts'
import OrderDetailsSection from './order-details-section'
import OrderStatistics from './order-statistics'
import OrdersSection from './orders-section'

type OrdersListProps = {
  defaultStatus: AdminOrderStatusSchema
}

export default function OrdersList({ defaultStatus }: OrdersListProps) {
  const [currPage, setCurrPage] = useState(1)
  const [activeStatus, setActiveStatus] =
    useState<AdminOrderStatusSchema>(defaultStatus)
  const [selectedOrderId, setSelectedOrderId] = useState<Order['id'] | null>(null)

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pe-14'>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
          <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
            <Suspense fallback={<Spinner />}>
              <OrderStatistics />
            </Suspense>

            <div className='space-y-2'>
              <div className='ms-auto flex items-center gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-7 gap-1 text-sm'
                    >
                      <ListFilter className='size-3.5' />
                      <span className='sr-only sm:not-sr-only'>فلتر</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start'>
                    <DropdownMenuLabel>فلتر بـ</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(orderFilterOptions).map(([value, label]) => (
                      <DropdownMenuCheckboxItem
                        key={value}
                        dir='rtl'
                        checked={value === activeStatus}
                        onCheckedChange={() => {
                          setActiveStatus(value as AdminOrderStatusSchema)
                          setCurrPage(1)
                        }}
                      >
                        {label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <OrdersSection
                defaultStatus={defaultStatus}
                currPage={currPage}
                setCurrPage={setCurrPage}
                activeStatus={activeStatus}
                selectedOrderId={selectedOrderId}
                setSelectedOrderId={setSelectedOrderId}
              />
            </div>
          </div>
          <div>
            <Suspense fallback={<Spinner />}>
              <OrderDetailsSection orderId={selectedOrderId} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
