import H1 from '@/components/h1'
import SearchField from '@/components/search-field'

import SearchResults from './_components/search-results'

export default function SearchPage() {
  return (
    <main className='container'>
      <SearchField />
      <H1 className='mt-6 sm:mt-0'>نتائج البحث</H1>
      <SearchResults />
    </main>
  )
}
