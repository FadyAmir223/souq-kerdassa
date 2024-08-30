'use client'

import type { Product } from '@repo/db/types'
import { useState } from 'react'

import ImageApi from '@/components/image'
import { Button } from '@/components/ui/button'

type ImageViewerProps = {
  name: Product['name']
  images: Product['images']
}

export default function ImageViewer({ name, images }: ImageViewerProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <>
      <div className='relative mb-5 aspect-[83/100] w-full'>
        <ImageApi
          src={images[activeImage]!}
          alt={name}
          fill
          priority
          sizes='
            (max-width: 480px) 100vw,
            (max-width: 768px) 33.3vw,
            20rem
          '
          className='object-cover'
        />
      </div>

      <div className='grid grid-cols-4 gap-3.5'>
        {images.map((image, i) => (
          <Button
            key={image}
            variant='none'
            size='none'
            className='relative aspect-[83/100] flex-1 enabled:opacity-60 disabled:opacity-100'
            onClick={() => setActiveImage(i)}
            disabled={i === activeImage}
          >
            <ImageApi
              src={image}
              alt={name}
              fill
              sizes='5rem'
              className='object-cover'
            />
          </Button>
        ))}
      </div>
    </>
  )
}
