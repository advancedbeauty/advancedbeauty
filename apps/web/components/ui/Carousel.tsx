'use client'
import React, { useCallback, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import {
  Navigation,
  Autoplay,
  EffectFade,
  EffectFlip,
  EffectCoverflow,
  EffectCube,
  EffectCards,
  EffectCreative,
} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import 'swiper/css/effect-fade'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface CarouselProps {
  items: React.ReactNode[]
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  navigationOn?: boolean
  loop?: boolean
  breakpoints?: { [width: number]: { slidesPerView: number } }
  className?: string
  autoplay?:
    | boolean
    | {
        delay: number
        disableOnInteraction?: boolean
        pauseOnMouseEnter?: boolean
        stopOnLastSlide?: boolean
      }
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip'
  speed?: number
}

const NavigationButton: React.FC<{ direction: 'prev' | 'next'; onClick: () => void }> = ({
  direction,
  onClick,
}) => (
  <button
    className="p-3 transition-colors border w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl duration-300 hover:bg-opacity-90"
    onClick={onClick}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
  >
    {direction === 'prev' ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
  </button>
)

const Carousel: React.FC<CarouselProps> = ({
  items,
  slidesPerView = 1,
  spaceBetween = 20,
  navigationOn = false,
  loop = true,
  breakpoints,
  className = '',
  autoplay = {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    stopOnLastSlide: false,
  },
  effect = 'slide',
  speed = 800,
}) => {
  const swiperRef = useRef<SwiperType | null>(null)

  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), [])
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), [])

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={spaceBetween}
          loop={loop}
          breakpoints={breakpoints}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper
          }}
          modules={[
            Navigation,
            Autoplay,
            EffectFade,
            EffectFlip,
            EffectCoverflow,
            EffectCube,
            EffectCards,
            EffectCreative,
          ]}
          autoplay={autoplay}
          effect={effect}
          speed={speed}
          fadeEffect={{ crossFade: true }}
          className="pb-12"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="flex-shrink-0">
              {item}
            </SwiperSlide>
          ))}
        </Swiper>
        {navigationOn && (
          <div className="flex justify-center gap-4 mt-6">
            <NavigationButton direction="prev" onClick={handlePrev} />
            <NavigationButton direction="next" onClick={handleNext} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Carousel
