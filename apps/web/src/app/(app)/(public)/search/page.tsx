import type { Metadata } from 'next'

import H1 from '@/app/(app)/_components/h1'
import SearchField from '@/app/(app)/_components/search-field'

import SearchResults from './_components/search-results'

export const metadata: Metadata = {
  title: 'نتائج البحث',
  description: 'ابحثي عن العبايات التي تفضلينها. اكتشفي تشكيلتنا المتنوعة بسهولة.',
}

export default function SearchPage() {
  return (
    <main className='container'>
      <SearchField />
      <H1 className='mt-6 md:mt-0'>نتائج البحث</H1>
      <SearchResults />
    </main>
  )
}
