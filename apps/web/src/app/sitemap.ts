import type { MetadataRoute } from 'next'

import { env } from '@/lib/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const { NEXT_PUBLIC_SITE_URL: SITE_URL } = env
  const currentDate = new Date().toISOString()

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: currentDate,
    },
    {
      url: `${SITE_URL}/product/sitemap.xml`,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: currentDate,
    },
    {
      url: `${SITE_URL}/search`,
      changeFrequency: 'weekly',
      priority: 0.3,
      lastModified: currentDate,
    },
    {
      url: `${SITE_URL}/login`,
      changeFrequency: 'yearly',
      priority: 0.4,
      lastModified: currentDate,
    },
    {
      url: `${SITE_URL}/register`,
      changeFrequency: 'yearly',
      priority: 0.4,
      lastModified: currentDate,
    },
  ]
}
