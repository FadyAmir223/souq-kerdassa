import { useCombinedStore } from '@repo/store/mobile'

export function CartTotalQuantity() {
  const quantity = useCombinedStore((s) => s.getCartTotalQuantity())

  return quantity
}

export function CartTotalPrice({ additionalCost = 0 }: { additionalCost?: number }) {
  const price = useCombinedStore((s) => s.getCartTotalPrice())
  return price + additionalCost
}
