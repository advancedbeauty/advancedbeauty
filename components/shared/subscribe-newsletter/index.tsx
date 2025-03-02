import React from 'react'
import { Roboto_Slab } from 'next/font/google'
import Section from '@/components/ui/features/Section'
import Container from '@/components/ui/features/Container'

const roboslab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const SubscribeNewsletter = () => {
  return (
    <Section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-[#FBF1EA]">
      <Container className="w-full flex flex-col items-center justify-center relative text-center px-4 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 -translate-x-1/2 w-full top-1/2 -translate-y-1/2 pointer-events-none flex justify-center items-center overflow-hidden">
          <span className="select-none text-[80px] sm:text-[130px] md:text-[200px] lg:text-[250px] xl:text-[300px] font-medium z-[5] text-[#fdf9f4] whitespace-nowrap">
            Subscribe
          </span>
        </div>
        <form className="z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 w-full max-w-5xl mb-10 md:mb-2">
          <div
            className={`flex flex-col lg:text-start uppercase ${roboslab.className} text-2xl sm:text-3xl font-[370] whitespace-nowrap`}
          >
            <span>Subscribe to</span>
            <span>our newsletter</span>
          </div>
          <div className="w-full lg:w-auto mt-4 sm:mt-6 lg:mt-0 flex flex-col sm:flex-row justify-center gap-4 lg:gap-0 flex-grow lg:max-w-2xl">
            <input
              type="text"
              placeholder="Enter your email..."
              className="border-b border-black py-3 w-full lg:flex-grow bg-transparent outline-none sm:text-left"
            />
            <button className="bg-black text-white px-6 py-3 w-full sm:w-auto whitespace-nowrap lg:ml-4">
              Subscribe
            </button>
          </div>
        </form>
      </Container>
    </Section>
  )
}

export default SubscribeNewsletter
