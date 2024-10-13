import type { Order, OrderStatus } from '@repo/db/types'
import type { AdminOrderStatusSchema } from '@repo/validators'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/trpc/react'
import { cn } from '@/utils/cn'

import { orderFilterOptions } from '../_utils/order-filter-opts'

type EditOrderStatusAdminProps = {
  order: {
    id: Order['id']
    status: OrderStatus
  }
  currPage: number
  activeStatus: AdminOrderStatusSchema
}

export default function EditOrderStatusAdmin({
  order,
  currPage,
  activeStatus,
}: EditOrderStatusAdminProps) {
  const { toast } = useToast()
  const utils = api.useUtils()

  const changeStatus = api.order.admin.changeStatus.useMutation({
    onMutate: async ({ status }) => {
      await utils.order.admin.all.cancel()
      const filters = { limit: 10, page: currPage, status: activeStatus }
      const oldOrders = utils.order.admin.all.getData(filters) ?? []

      const newOrders = oldOrders.map((_order) =>
        _order.id === order.id ? { ..._order, status } : _order,
      )

      utils.order.admin.all.setData(filters, newOrders)

      return { oldOrders, oldStatus: order.status, newStatus: status }
    },
    onSuccess: (_, __, { oldStatus, newStatus }) => {
      // inconvenient cache invalidation
      // void utils.order.admin.invalidate()

      const hasCompleted = oldStatus === 'completed' || newStatus === 'completed'
      const hasPending = oldStatus === 'pending' || newStatus === 'pending'

      void Promise.all([
        // statistics only if order was or became completed
        hasCompleted ? utils.order.admin.statistics.invalidate() : Promise.resolve(),

        // pending count only if order was or became pending
        hasPending
          ? utils.order.admin.count.invalidate('pending')
          : Promise.resolve(),

        // order may be cached
        utils.order.admin.detailsById.invalidate(order.id),

        // controls { limit, status } but can't control page
        utils.order.admin.all.invalidate(),

        // for totalPaid and totalPending
        hasCompleted || hasPending
          ? utils.user.admin.all.invalidate()
          : Promise.resolve(),
      ])
    },
    onError: ({ message }, _, ctx) => {
      utils.order.admin.all.setData(
        { limit: 10, page: currPage, status: activeStatus },
        ctx?.oldOrders,
      )

      toast({
        description: message,
        variant: 'destructive',
      })
    },
  })

  const handleOrderStatusChange = (value: AdminOrderStatusSchema) => {
    if (order.status === value) return

    changeStatus.mutate({
      orderId: order.id,
      status: value,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup='true' size='icon' variant='ghost'>
          <Badge
            variant='secondary'
            className={cn('text-xs before:me-1 before:size-2 before:rounded-full', {
              'text-yellow-500 before:bg-yellow-500': order.status === 'pending',
              'text-green-500 before:bg-green-500': order.status === 'completed',
              'text-gray-500 before:bg-gray-500': order.status === 'cancelled',
              'text-orange-500 before:bg-orange-500': order.status === 'refunded',
            })}
          >
            {orderFilterOptions[order.status]}
          </Badge>
          <span className='sr-only'>بدل حالة الطلب</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-fit'>
        {Object.entries(orderFilterOptions)
          .slice(1)
          .map(([value, label]) => (
            <DropdownMenuItem key={value}>
              <Button
                size='none'
                variant='ghost'
                className='w-full'
                onClick={() =>
                  handleOrderStatusChange(value as AdminOrderStatusSchema)
                }
              >
                <Badge
                  variant='secondary'
                  className={cn(
                    'text-xs before:me-1 before:size-2 before:rounded-full',
                    {
                      'text-yellow-500 before:bg-yellow-500': value === 'pending',
                      'text-green-500 before:bg-green-500': value === 'completed',
                      'text-gray-500 before:bg-gray-500': value === 'cancelled',
                      'text-orange-500 before:bg-orange-500': value === 'refunded',
                    },
                  )}
                >
                  {label}
                </Badge>
              </Button>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
