import { MaterialIcons } from '@expo/vector-icons'
import React, { Fragment } from 'react'
import { View } from 'react-native'
// import { cssInterop } from 'nativewind'
// import { cssInterop } from 'react-native-css-interop'

//  TODO do it the right way
// cssInterop(MaterialIcons, {
//   className: {
//     target: 'style',
//     nativeStyleToProp: { height: true, width: true, size: true },
//   },
// })

const scales = {
  sm: 28,
  md: 30,
  lg: 34,
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
            <MaterialIcons name='star' color='#eab308' size={scales[scale]} />
          ) : idx + 1 > rating && idx < rating ? (
            <View className='-scale-x-100'>
              <MaterialIcons name='star-half' color='#eab308' size={scales[scale]} />
            </View>
          ) : (
            <MaterialIcons name='star-border' color='#eab308' size={scales[scale]} />
          )}
        </Fragment>
      ))}
    </View>
  )
}
