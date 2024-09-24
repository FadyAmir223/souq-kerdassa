'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useShallow } from 'zustand/react/shallow'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAppStore } from '@/providers/app-store-provider'
import type { RouterOutputs } from '@/trpc/react'
import { api } from '@/trpc/react'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

import CheckoutAddresses from './checkout-addresses'

type CheckoutAddressSelectionProps = {
  children: ReactNode
  addresses: RouterOutputs['user']['addresses']['all']
}

export default function CheckoutAddressSelection({
  children,
  addresses,
}: CheckoutAddressSelectionProps) {
  const [isOpen, setOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    cart,
    getCartTotalQuantity,
    updateOverQuantities,
    selectedAddress,
    setSelectedAddress,
  } = useAppStore(
    useShallow(
      ({
        cart,
        getCartTotalQuantity,
        updateOverQuantities,
        selectedAddress,
        setSelectedAddress,
      }) => ({
        cart,
        getCartTotalQuantity,
        updateOverQuantities,
        selectedAddress,
        setSelectedAddress,
      }),
    ),
  )

  const createOrder = api.order.create.useMutation({
    onSuccess: () => {
      setOpen(true)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: error.message,
      })

      // @ts-expect-error impossible typing
      const soldOutVariants = error.data?.cause?.soldOutVariants
      if (soldOutVariants) updateOverQuantities(soldOutVariants)
    },
  })

  const handleCreateOrder = () => {
    if (selectedAddress === null) return setSelectedAddress(undefined)
    if (selectedAddress === undefined) return

    createOrder.mutate({
      address: selectedAddress,
      cart,
    })
  }

  const handlePurchaseSuccess = () => {
    router.replace(
      `${PAGES.protected.user.orders}?${SEARCH_PARAMS.redirectedFrom}=${PAGES.protected.buy.checkout}`,
    )

    router.refresh()
  }

  return (
    <>
      <section className='mb-16'>
        {children}

        <CheckoutAddresses addresses={addresses} />
      </section>

      <div className='text-center'>
        {getCartTotalQuantity() > 0 ? (
          <Button
            className='min-w-32 text-lg'
            onClick={handleCreateOrder}
            disabled={createOrder.isPending}
          >
            شراء
          </Button>
        ) : (
          <p className='text-lg font-bold'>
            عذراً لقد نفذت الكمية من كل المنتجات المطلوبة
          </p>
        )}
      </div>

      <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center'>
              <FaCheckCircle className='mx-auto size-[4.5rem] text-green-700' />
              <span className='mt-4 inline-block'>تم تأكيد الطلب بنجاح</span>
            </AlertDialogTitle>
            <AlertDialogDescription className='text-center'>
              شكراً للتسوق معنا
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='mx-auto'>
            <AlertDialogAction onClick={handlePurchaseSuccess}>
              تتبع الطلب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
