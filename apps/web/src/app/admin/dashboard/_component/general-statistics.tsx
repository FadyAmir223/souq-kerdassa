// TODO: device type analytics

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/trpc/server'

export default async function GeneralStatistics() {
  const [totalUsers, { totalAllTime, pendingAllTime }] = await Promise.all([
    api.user.admin.count(),
    api.order.admin.allTimeStatistics(),
  ])

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>العملاء</CardDescription>
          <CardTitle className='text-4xl'>{totalUsers}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>الربح الكلى</CardDescription>
          <CardTitle className='text-4xl'>{totalAllTime}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>الربح المعلق</CardDescription>
          <CardTitle className='text-4xl'>{pendingAllTime}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
