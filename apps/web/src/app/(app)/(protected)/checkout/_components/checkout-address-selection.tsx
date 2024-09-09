'use client'

import type { RouterOutputs } from '@repo/api'
import type { Order } from '@repo/db/types'
import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { Suspense, useState } from 'react'
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
import { PAGES } from '@/utils/constants'

import AddressSkeleton from '../../account/address/_components/address-skeleton'
import CheckoutAddresses from './checkout-addresses'

type Address = RouterOutputs['user']['addresses']['all'][number] | null | undefined

export default function CheckoutAddressSelection({ children }: PropsWithChildren) {
  const { toast } = useToast()
  const [selectedAddress, setSelectedAddress] = useState<Address>(null)

  const [dialog, setDialog] = useState<{
    open: boolean
    orderId: Order['id'] | null
  }>({
    open: false,
    orderId: null,
  })

  const { cart, updateOverQuantities, resetCart } = useAppStore(
    useShallow(({ cart, updateOverQuantities, resetCart }) => ({
      cart,
      updateOverQuantities,
      resetCart,
    })),
  )

  const router = useRouter()

  const createOrder = api.order.create.useMutation({
    onSuccess: (orderId) => {
      setDialog({ open: true, orderId })
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
    resetCart()
    router.replace(PAGES.protected.user.orders)
  }

  return (
    <>
      <section className='mb-16'>
        {children}

        <ul className='grid gap-4 md:grid-cols-2'>
          <Suspense fallback={<AddressSkeleton />}>
            <CheckoutAddresses
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />
          </Suspense>
        </ul>
      </section>

      <div className='text-center'>
        <Button
          className='min-w-32 text-lg'
          onClick={handleCreateOrder}
          disabled={createOrder.isPending}
        >
          شراء
        </Button>
      </div>

      <AlertDialog
        open={dialog.open}
        onOpenChange={() =>
          setDialog((prevDialog) => ({ ...prevDialog, open: !prevDialog.open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-right'>
              الطلب رقم{' '}
              <span className='text-lg font-semibold text-primary'>
                {dialog.orderId}
              </span>{' '}
              تم بنجاح
            </AlertDialogTitle>
            <AlertDialogDescription className='text-right'>
              ستصلك المنتجات قريباً
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handlePurchaseSuccess}>
              حسناً
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
