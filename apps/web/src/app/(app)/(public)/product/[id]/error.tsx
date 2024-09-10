'use client'

import H1 from '@/components/h1'
import { Button } from '@/components/ui/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='text-center'>
      <H1>حدث خطأ</H1>
      <Button variant='outline' onClick={() => reset()}>
        حاول مجدداً
      </Button>
    </div>
  )
}
