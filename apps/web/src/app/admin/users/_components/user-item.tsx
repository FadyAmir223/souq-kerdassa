import { TableCell, TableRow } from '@/components/ui/table'
import type { RouterOutputs } from '@/trpc/react'

type UserItemProps = {
  user: RouterOutputs['user']['admin']['all'][number]
}

export default function UserItem({ user }: UserItemProps) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{user.name}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.city}</TableCell>
      <TableCell>{user.orderCount}</TableCell>
      <TableCell className='hidden md:table-cell'>{user.totalPending}</TableCell>
      <TableCell>{user.totalPaid}</TableCell>
    </TableRow>
  )
}
