import { useState } from 'react'
import { Image as RNImage, PixelRatio } from 'react-native'
import type { FastImageProps } from 'react-native-fast-image'

import { getBaseUrl } from '@/utils/base-url'
import { SEARCH_PARAMS } from '@/utils/constants'

// https://tarasov.dev/blog/how-to-use-nextjs-image-optimization-in-react-native/

function extractStyleWidth(className?: FastImageProps['className']) {
  if (!className) return

  const widthPattern = /^w-(\d+)$/

  const widthClass = className.split(' ').find((cls) => widthPattern.test(cls))
  if (!widthClass) return

  const match = widthPattern.exec(widthClass)
  if (!match) return

  return +match[1]! * 4
}

const config = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}

const SIZES = [...config.imageSizes, ...config.deviceSizes]

function normalizeWidth(width: number): number {
  const calculatedSize = PixelRatio.getPixelSizeForLayoutSize(width)
  const matchingIndex = SIZES.findIndex((size) => size >= calculatedSize)

  if (matchingIndex === -1) return SIZES[SIZES.length - 1]!
  else if (matchingIndex === 0) return SIZES[0]!
  const left = SIZES[matchingIndex - 1]!
  const right = SIZES[matchingIndex]!

  if ((left + right) / 2 > width) return left

  return right
}

interface ImageLoaderConfig {
  src: string
  width: number
  quality?: number
}

function imageLoader({ src, width, quality }: ImageLoaderConfig) {
  const url = new URL('api/assets/images', getBaseUrl())

  url.searchParams.append(SEARCH_PARAMS.path, src)
  url.searchParams.append(SEARCH_PARAMS.width, width.toString())
  url.searchParams.append(SEARCH_PARAMS.quality, String(quality ?? 75))

  return url.toString()
}

export interface Props extends FastImageProps {
  unoptimized?: boolean
  width?: number
  quality?: number
}

export function Image({
  unoptimized,
  source,
  width,
  quality,
  className,
  onLayout,
  ...props
}: Props) {
  const staticWidth = extractStyleWidth(className) ?? width
  const [imageWidth, setImageWidth] = useState(staticWidth)

  return (
    // ? why FastImage not working?
    <RNImage
      {...props}
      onLayout={(event) => {
        if (onLayout) onLayout(event)
        if (!staticWidth) setImageWidth(event.nativeEvent.layout.width)
      }}
      // @ts-expect-error ...
      source={
        !unoptimized && typeof source === 'object' && 'uri' in source && source.uri
          ? {
              ...source,
              uri: imageWidth
                ? imageLoader({
                    src: source.uri,
                    width: normalizeWidth(imageWidth),
                    quality,
                  })
                : undefined,
            }
          : source
      }
      className={className}
    />
  )
}
