'use client'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import ImageApi from '@/components/image'

export default function ImageSlider() {
  return (
    <Swiper
      loop={true}
      autoplay={{ delay: 5000, reverseDirection: true }}
      modules={[Autoplay]}
      speed={900}
    >
      {[1, 2].map((i) => (
        <SwiperSlide key={i}>
          <div className='relative aspect-[3/1] overflow-hidden'>
            <ImageApi
              src={`/landing/${i}.png`}
              alt='landing'
              fill
              sizes='100vw'
              priority
              className='object-cover'
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
