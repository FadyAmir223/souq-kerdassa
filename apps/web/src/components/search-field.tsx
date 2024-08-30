'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { useDebounce } from 'use-debounce'

import { cn } from '@/utils/cn'
import { SEARCH_PARAMS } from '@/utils/constants'

import { Input } from './ui/input'

export default function SearchField() {
  const pathname = usePathname()
  const router = useRouter()

  const searchParams = useSearchParams()
  const savedQuery = searchParams.get(SEARCH_PARAMS.query)
  const [query, setQuery] = useState(savedQuery ?? '')
  const [debouncedQuery] = useDebounce(query, 400)

  const inputRef = useRef<HTMLInputElement>(null)

  const isSearch = pathname === '/search'

  useEffect(() => {
    if (isSearch) inputRef.current?.focus()
  }, [isSearch])

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    if (debouncedQuery && isSearch) current.set(SEARCH_PARAMS.query, debouncedQuery)
    else current.delete(SEARCH_PARAMS.query)

    const search = current.toString()
    const queries = search ? `?${search}` : ''

    void router.replace(`${pathname}${queries}`)
  }, [debouncedQuery, pathname, router, searchParams, isSearch])

  return (
    <Link
      href='/search'
      className='flex flex-1 rounded-md ring-1 ring-black'
      onClick={(e) => {
        if (isSearch) e.preventDefault()
      }}
    >
      <div className='grid place-items-center rounded-r-md bg-primary px-5'>
        <LuSearch className='size-5 md:size-[1.375rem]' />
      </div>

      <Input
        ref={inputRef}
        type='text'
        placeholder='بحث'
        className={cn(
          'rounded-l-md rounded-r-none bg-[#e6e6e6] focus-visible:ring-0',
          !isSearch && 'cursor-pointer',
        )}
        readOnly={!isSearch}
        value={isSearch ? query : ''}
        onChange={(e) => setQuery(e.target.value)}
      />
    </Link>
  )
}
