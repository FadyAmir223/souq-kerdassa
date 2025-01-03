'use client'

import Image from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

import { ASSETS, SEARCH_PARAMS } from '@/utils/constants'

type ImageApiProps = ComponentPropsWithoutRef<typeof Image>

export default function ImageApi({ src, alt, ...props }: ImageApiProps) {
  return src ? (
    <Image
      src={src}
      loader={({ src: _src, width, quality }) =>
        `${ASSETS.images}?${SEARCH_PARAMS.path}=${_src}&${SEARCH_PARAMS.width}=${width}&${SEARCH_PARAMS.quality}=${quality ?? 75}`
      }
      alt={alt}
      {...props}
    />
  ) : (
    <div className='h-full bg-neutral-500/50' />
  )
}
