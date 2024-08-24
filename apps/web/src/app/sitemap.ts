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
  ]
}
