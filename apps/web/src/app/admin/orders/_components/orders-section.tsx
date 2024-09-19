import type { Order } from '@repo/db/types'
import type { AdminOrderStatusSchema } from '@repo/validators'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/trpc/react'

import AdminPagination from '../../_components/admin-pagination'
import EditOrderStatusAdmin from './edit-order-status-admin'

type OrdersSectionProps = {
  defaultStatus: AdminOrderStatusSchema
  currPage: number
  setCurrPage: (newPage: number) => void
  activeStatus: AdminOrderStatusSchema
  selectedOrderId: Order['id'] | null
  setSelectedOrderId: (newOrderId: Order['id']) => void
}

export default function OrdersSection({
  defaultStatus,
  currPage,
  activeStatus,
  setCurrPage,
  selectedOrderId,
  setSelectedOrderId,
}: OrdersSectionProps) {
  const [totalOrders] = api.order.admin.count.useSuspenseQuery(defaultStatus, {
    staleTime: 3 * 60 * 1000,
  })

  const [orders] = api.order.admin.all.useSuspenseQuery(
    {
      limit: 10,
      page: currPage,
      status: activeStatus,
    },
    {
      staleTime: 3 * 60 * 1000,
    },
  )

  if (orders.length === 0)
    return <h3 className='mt-3 text-center font-semibold'>لا يوجد طلبات</h3>

  return (
    <Card>
      <CardHeader className='px-7'>
        <CardTitle>الطلبات</CardTitle>
        <CardDescription>اخر الطلبات من متجرك</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>العميل</TableHead>
              <TableHead className='hidden sm:table-cell'>الكمية</TableHead>
              <TableHead className='hidden sm:table-cell'>الحالة</TableHead>
              <TableHead className='text-right'>السعر</TableHead>
              <TableHead className='hidden md:table-cell'>التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className='odd:bg-accent'>
                <TableCell>
                  <Checkbox
                    checked={selectedOrderId === order.id}
                    onCheckedChange={() => setSelectedOrderId(order.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className='font-medium'>{order.user.name}</div>
                  <div className='hidden text-sm text-muted-foreground md:inline'>
                    {order.user.phone}
                  </div>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {order.quantity}
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <EditOrderStatusAdmin
                    order={{
                      id: order.id,
                      status: order.status,
                    }}
                    currPage={currPage}
                    activeStatus={activeStatus}
                  />
                </TableCell>
                <TableCell className='text-right'>{order.totalPrice}</TableCell>
                <TableCell className='hidden text-sm md:table-cell'>
                  {format(order.createdAt, 'yyyy-MM-dd', { locale: ar })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        <AdminPagination
          currPage={currPage}
          setCurrPage={setCurrPage}
          totalItems={totalOrders}
        />
      </CardFooter>
    </Card>
  )
}
