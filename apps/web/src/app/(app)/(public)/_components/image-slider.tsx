'use client'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import Image from 'next/image'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import landing1 from '@/public/assets/images/landing/1.png'
import landing2 from '@/public/assets/images/landing/2.png'

export default function ImageSlider() {
  return (
    <Swiper
      loop={true}
      autoplay={{ delay: 5000, reverseDirection: true }}
      modules={[Autoplay]}
      speed={900}
    >
      {[landing1, landing2].map((image, i) => (
        <SwiperSlide key={i}>
          <Image
            src={image}
            alt='landing'
            sizes='100vw'
            priority
            className='object-cover'
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
