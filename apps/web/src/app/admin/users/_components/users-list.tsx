'use client'

'use client'

import { useState } from 'react'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/trpc/react'

import AdminPagination from '../../_components/admin-pagination'
import UserItem from './user-item'

export default function UsersList() {
  const [currPage, setCurrPage] = useState(1)

  const [totalUsers] = api.user.admin.count.useSuspenseQuery(undefined, {
    staleTime: 3 * 60 * 1000,
  })

  const [users] = api.user.admin.all.useSuspenseQuery(
    { limit: 10, page: currPage },
    { staleTime: 3 * 60 * 1000 },
  )

  return (
    <Card className='overflow-x-auto'>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الإسم</TableHead>
              <TableHead>التليفون</TableHead>
              <TableHead>المحافظة</TableHead>
              <TableHead>الطلبات</TableHead>
              <TableHead className='hidden md:table-cell'>المعلق</TableHead>
              <TableHead>المدفوع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserItem key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AdminPagination
        currPage={currPage}
        setCurrPage={setCurrPage}
        totalItems={totalUsers}
      />

      <CardFooter>
        <div className='text-xs text-muted-foreground'>
          يعرض{' '}
          <strong>
            {(currPage - 1) * 10 + 1} إلى {Math.min(currPage * 10, totalUsers)}
          </strong>{' '}
          من <strong>{totalUsers}</strong> عميل
        </div>
      </CardFooter>
    </Card>
  )
}
