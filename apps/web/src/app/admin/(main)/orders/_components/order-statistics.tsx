import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { api } from '@/trpc/react'

export default function OrderStatistics() {
  const [statistics] = api.order.admin.statistics.useSuspenseQuery(undefined, {
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4'>
      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>هذا الاسبوع</CardDescription>
          <CardTitle className='text-4xl'>{statistics.totalThisWeek}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-xs text-muted-foreground'>
            {statistics.weeklyPercentageChange}% من الاسبوع السابق
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={statistics.weeklyPercentageChange}
            aria-label={`${statistics.weeklyPercentageChange}% increase`}
          />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardDescription>هذا الشهر</CardDescription>
          <CardTitle className='text-4xl'>{statistics.totalThisMonth}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-xs text-muted-foreground'>
            {statistics.monthlyPercentageChange}% من الشهر السابق
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={statistics.monthlyPercentageChange}
            aria-label={`${statistics.monthlyPercentageChange}% increase`}
          />
        </CardFooter>
      </Card>
    </div>
  )
}
