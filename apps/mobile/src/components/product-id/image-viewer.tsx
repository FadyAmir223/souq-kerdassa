import type { Product } from '@repo/db/types'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Image } from '@/components/image'

type ImageViewerProps = {
  images: Product['images']
}

export default function ImageViewer({ images }: ImageViewerProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <>
      <View className='mb-5 items-center justify-center bg-neutral-500/50'>
        <Image
          source={{ uri: images[activeImage]! }}
          resizeMode='cover'
          className='aspect-[83/100] w-full'
        />
      </View>

      <View className='flex-row gap-x-3.5'>
        {images.map((image, i) => (
          <Pressable
            key={image}
            className='flex-[0.25] bg-neutral-500/50 enabled:opacity-60 disabled:opacity-100'
            onPress={() => setActiveImage(i)}
            disabled={i === activeImage}
          >
            <Image
              source={{ uri: image }}
              className='aspect-[83/100] w-full'
              resizeMode='cover'
            />
          </Pressable>
        ))}
      </View>
    </>
  )
}
