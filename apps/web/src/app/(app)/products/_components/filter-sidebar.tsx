import FilterOptions from './filter-options'

type FilterSidebarProps = {
  hasParams: boolean
}

export default function FilterSidebar({ hasParams }: FilterSidebarProps) {
  return (
    <aside className='hidden h-fit min-w-64 rounded-md bg-white px-3.5 py-6 md:block'>
      <h4 className='mb-4 text-center text-lg font-semibold'>فلتر</h4>
      <FilterOptions hasParams={hasParams} />
    </aside>
  )
}
