'use client'

import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { Suspense, useState } from 'react'
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
import { api } from '@/trpc/react'
import { PAGES, SEARCH_PARAMS } from '@/utils/constants'

import AddressSkeleton from '../../account/address/_components/address-skeleton'
import CheckoutAddresses from './checkout-addresses'

export default function CheckoutAddressSelection({ children }: PropsWithChildren) {
  const [isOpen, setOpen] = useState(false)
  const router = useRouter()
  const utils = api.useUtils()
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
      setSelectedAddress(null)
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

  const handlePurchaseSuccess = async () => {
    await utils.order.all.invalidate()

    router.replace(
      `${PAGES.protected.user.orders}?${SEARCH_PARAMS.redirectFrom}=${PAGES.protected.buy.checkout}`,
    )
  }

  return (
    <>
      <section className='mb-16'>
        {children}

        <ul className='grid gap-4 md:grid-cols-2'>
          <Suspense fallback={<AddressSkeleton />}>
            <CheckoutAddresses />
          </Suspense>
        </ul>
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
