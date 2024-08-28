import ProductList from '@/app/(app)/_components/product/product-list'

export default function SimilarProducts() {
  return (
    <section className='pt-14'>
      <h2 className='mb-3 text-2xl font-bold tracking-wider'>قد تعجبك</h2>

      {/* TOOD: real relevance */}
      <ProductList type='SUMMER' />
    </section>
  )
}
