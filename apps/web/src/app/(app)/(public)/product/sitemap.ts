import type { MetadataRoute } from 'next'

import { env } from '@/lib/env'
import { api } from '@/trpc/server'

export const revalidate = 86400

// if exceed 50000 (which won't) consider splitting

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const product = await api.product.ids()
  const currentDate = new Date().toISOString()

  return product.map((product) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
    changeFrequency: 'yearly',
    lastModified: currentDate,
  }))
}
