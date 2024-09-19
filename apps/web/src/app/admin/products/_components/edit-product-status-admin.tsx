import type { Product } from '@repo/db/types'
import type { AdminProductStatusSchema } from '@repo/validators'

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

import { tabs } from '../_utils/tabs'

type EditProductStatusAdminProps = {
  product: {
    id: Product['id']
    visibility: Product['visibility']
  }
  currPage: number
  activeTab: AdminProductStatusSchema
}

export default function EditProductStatusAdmin({
  product,
  currPage,
  activeTab,
}: EditProductStatusAdminProps) {
  const { toast } = useToast()
  const utils = api.useUtils()

  const changeStatus = api.product.admin.changeStatus.useMutation({
    onMutate: async ({ visibility }) => {
      await utils.product.admin.all.cancel()
      const filters = { limit: 10, page: currPage, visibility: activeTab }
      const oldProducts = utils.product.admin.all.getData(filters) ?? []

      const newProducts = oldProducts.map((_product) =>
        _product.id === product.id ? { ..._product, visibility } : _product,
      )

      utils.product.admin.all.setData(filters, newProducts)

      return { oldProducts }
    },
    onError: ({ message }, _, ctx) => {
      utils.product.admin.all.setData(
        { limit: 10, page: currPage, visibility: activeTab },
        ctx?.oldProducts,
      )

      toast({
        description: message,
        variant: 'destructive',
      })
    },
  })

  const handleProductStatusChange = (value: AdminProductStatusSchema) => {
    if (product.visibility === value) return

    changeStatus.mutate({
      productId: product.id,
      visibility: value,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup='true' size='icon' variant='ghost'>
          <Badge
            variant='outline'
            className={cn('text-white', {
              'bg-sky-500': product.visibility === 'active',
              'bg-destructive': product.visibility === 'draft',
            })}
          >
            {product.visibility === 'active' ? 'نشط' : 'مخفى'}
          </Badge>
          <span className='sr-only'>بدل ظهور المنتج</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-fit'>
        {tabs.slice(1).map(({ label, value }) => (
          <DropdownMenuItem key={value}>
            <Button
              size='none'
              className='w-full'
              variant='ghost'
              onClick={() => handleProductStatusChange(value)}
            >
              <Badge
                variant='outline'
                className={cn('w-full text-center text-white', {
                  'bg-sky-500': value === 'active',
                  'bg-destructive': value === 'draft',
                })}
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
