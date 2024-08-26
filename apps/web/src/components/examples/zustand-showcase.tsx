'use client'

import { useAppStore } from '@/providers/counter-store-provider'

export default function ZustandShowcase() {
  const count = useAppStore((s) => s.count)
  const increment = useAppStore((s) => s.increment)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => increment(1)}>increment</button>
    </div>
  )
}
