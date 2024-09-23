'use client'

import { DialogDescription } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { MdFilterAlt } from 'react-icons/md'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import FilterOptions from './filter-options'

type FilterDrawerProps = {
  hasParams: boolean
}

export default function FilterDrawer({ hasParams }: FilterDrawerProps) {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            className='flex w-fit items-center gap-x-2.5 font-semibold md:hidden'
            variant='secondary'
          >
            <span>فلتر</span>
            <MdFilterAlt size={18} />
          </Button>
        </DrawerTrigger>

        <DrawerContent className='px-4 py-8'>
          <DrawerHeader>
            <DrawerTitle>فلتر</DrawerTitle>
          </DrawerHeader>

          <DialogDescription />
          <FilterOptions hasParams={hasParams} />
        </DrawerContent>
      </Drawer>
    </>
  )
}
