import { Image, View } from 'react-native'
import Swiper from 'react-native-swiper'

import landing1 from '@/assets/images/landing/1.jpg'
import landing2 from '@/assets/images/landing/2.jpg'

export default function ImageSlider() {
  return (
    <View className='h-64'>
      <Swiper
        loop={true}
        autoplay={true}
        autoplayTimeout={5}
        dot={<View />}
        activeDot={<View />}
      >
        {[landing1, landing2].map((image, index) => (
          <Image
            key={index}
            source={image}
            className='size-full'
            resizeMode='contain'
          />
        ))}
      </Swiper>
    </View>
  )
}
