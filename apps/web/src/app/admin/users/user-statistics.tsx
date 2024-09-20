import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/trpc/server'

export default async function UserStatistics() {
  const statistics = await api.user.admin.statistics()

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>العملاء الجدد هذا الشهر</CardDescription>
          <CardTitle className='text-4xl'>{statistics.totalThisMonth}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
