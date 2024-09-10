import ProductMiniList from '../../../_components/product/product-list'

export default function SimilarProducts() {
  return (
    <section className='pt-14'>
      <h2 className='mb-3 text-2xl font-bold'>قد تعجبك</h2>

      {/* TODO: real relevance */}
      {/* @ts-expect-error page & limit has default */}
      <ProductMiniList filter={{ season: 'summer' }} />
    </section>
  )
}
