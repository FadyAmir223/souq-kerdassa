import H1 from '@/components/h1'

import SearchResults from './_components/search-results'

export default function SearchPage() {
  return (
    <main className='container'>
      <H1>نتائج البحث</H1>
      <SearchResults />
    </main>
  )
}
