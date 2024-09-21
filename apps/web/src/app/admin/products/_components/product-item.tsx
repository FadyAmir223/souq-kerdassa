import type { RouterOutputs } from '@repo/api'
import type { AdminProductStatusSchema } from '@repo/validators'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import ImageApi from '@/components/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'

import { PAGES } from '../../_utils/constants'
import DeleteProductAdmin from './delete-product-admin'
import EditProductStatusAdmin from './edit-product-status-admin'

type ProductItemProps = {
  product: RouterOutputs['product']['admin']['all'][number]
  currPage: number
  setCurrPage: (newCurrPage: number) => void
  activeTab: AdminProductStatusSchema
  totalProducts: number
  index: number
}

export default function ProductItem({
  product,
  currPage,
  setCurrPage,
  activeTab,
  totalProducts,
  index,
}: ProductItemProps) {
  return (
    <TableRow>
      <TableCell className='hidden sm:table-cell'>
        <div className='relative aspect-[83/100] w-16'>
          <ImageApi
            src={product.image}
            alt={product.name}
            className='rounded-sm object-cover'
            fill
            priority={index < 5}
            sizes='4rem'
          />
        </div>
      </TableCell>
      <TableCell className='font-medium'>{product.name}</TableCell>
      <TableCell>
        <EditProductStatusAdmin
          product={{
            id: product.id,
            visibility: product.visibility,
          }}
          currPage={currPage}
          activeTab={activeTab}
        />
      </TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>{product.sales}</TableCell>
      <TableCell className='hidden md:table-cell'>
        {format(product.createdAt, 'yyyy-MM-dd', { locale: ar })}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup='true' size='icon' variant='ghost'>
              <MoreHorizontal className='size-4' />
              <span className='sr-only'>افعال</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <Button asChild variant='none' className='block w-full px-2 py-1.5'>
                <Link className='text-center' href={PAGES.products.edit(product.id)}>
                  تعديل
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteProductAdmin
                productId={product.id}
                currPage={currPage}
                activeTab={activeTab}
                setCurrPage={setCurrPage}
                totalProducts={totalProducts}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
