import Link from 'next/link'
import { IoClose } from 'react-icons/io5'

import FilterButton from './filter-button'

const filters = [
  {
    title: 'ترتيب بالـ',
    key: 'type',
    options: [
      { label: 'الاحدث', value: 'latest' },
      { label: 'الاكثر تقييماً', value: 'top-rated' },
    ],
  },
  {
    title: 'الموسم',
    key: 'season',
    options: [
      { label: 'صيفى', value: 'summer' },
      { label: 'شتوى', value: 'winter' },
    ],
  },
  {
    title: 'الفئة',
    key: 'category',
    options: [
      { label: 'نساء', value: 'women' },
      { label: 'اطفال', value: 'children' },
    ],
  },
]

type FilterOptionsProps = {
  hasParams: boolean
}

export default function FilterOptions({ hasParams }: FilterOptionsProps) {
  return (
    <>
      {hasParams && (
        <Link
          href='/products'
          replace
          className='mb-3 mr-auto flex w-fit items-center gap-x-2 text-sm text-destructive'
        >
          <span className=''>مسح الفلتر</span>
          <IoClose className='size-5' />
        </Link>
      )}

      <div className='space-y-4'>
        {filters.map((filter) => (
          <div key={filter.key} className=''>
            <p className='mb-2 font-semibold'>{filter.title}</p>
            <div className='flex flex-wrap gap-x-2.5'>
              {filter.options.map(({ label, value }) => (
                <FilterButton
                  key={label}
                  filterKey={filter.key}
                  label={label}
                  value={value}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}