import { MaterialIcons } from '@expo/vector-icons'
import { cssInterop } from 'nativewind' // 'react-native-css-interop'
import React, { Fragment } from 'react'
import { View } from 'react-native'

// @ts-expect-error apply className for icons
cssInterop(MaterialIcons, {
  className: {
    target: 'style',
    nativeStyleToProp: { height: true, width: true, size: true },
  },
})

const scales = {
  sm: 'text-[1.75rem]',
  md: 'text-[1.875rem]',
  lg: 'text-[2.125rem]',
}

type StarRatingProps = {
  rating: number
  scale?: keyof typeof scales
}

export default function StarRating({ rating, scale = 'sm' }: StarRatingProps) {
  return (
    <View className='flex-row items-center'>
      {Array.from({ length: 5 }).map((_, idx) => (
        <Fragment key={idx}>
          {idx + 1 <= rating ? (
            <MaterialIcons
              name='star'
              className={`${scales[scale]} text-yellow-500`}
            />
          ) : idx + 1 > rating && idx < rating ? (
            <MaterialIcons
              name='star-half'
              className={`${scales[scale]} text-yellow-500`}
            />
          ) : (
            <MaterialIcons
              name='star-border'
              className={`${scales[scale]} text-yellow-500`}
            />
          )}
        </Fragment>
      ))}
    </View>
  )
}
