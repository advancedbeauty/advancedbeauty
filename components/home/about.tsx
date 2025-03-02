import React from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import Image from 'next/image';
import { Roboto_Slab } from 'next/font/google';

const roboslab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const Aboutsection = () => {
  return (
    <Section className="py-20 lg:py-40 bg-[#FBF1EA]">
      <Container className="w-full flex flex-col lg:flex-row items-center justify-center md:justify-between gap-10 relative text-center lg:text-left lg:px-10">
        <div className="absolute left-1/2 -translate-x-1/2 w-full top-1/2 -translate-y-1/2 pointer-events-none flex justify-center items-center overflow-hidden">
          <span className="select-none text-[80px] sm:text-[130px] md:text-[200px] lg:text-[250px] xl:text-[300px] font-medium z-[5] text-[#fdf9f4] whitespace-nowrap">
            about us
          </span>
        </div>
        <div className="z-10 w-full lg:w-1/2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[600px] font-medium mx-auto lg:mx-0">
            We are the Solution to All Your Beauty Problems !
          </h1>
          <p className="mt-6 md:mt-10 max-w-[700px] mx-auto lg:mx-0">
            I have been a passionate makeup artist based in India for over 10
            years With a degree in art and an ability to connect with each
            individual client, I feel privileged to work within such a broad and
            creative industry. Fully qualified as both a hair and makeup
            technician, I now have an extensive portfolio of projects comprising
            of everything from bridal hair and fashion shoots to catwalk models
            and media stars.
          </p>
          <div
            className={`flex flex-col sm:flex-row justify-center lg:justify-start gap-8 sm:gap-16 mt-6 md:mt-10 ${roboslab.className}`}
          >
            <div className="flex gap-2 items-center justify-center sm:justify-start">
              <div className="text-5xl sm:text-7xl">18</div>
              <div className="flex flex-col text-lg sm:text-2xl font-light text-start">
                <span>Professional</span>
                <span>masters</span>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-center sm:justify-start">
              <div className="text-5xl sm:text-7xl">265</div>
              <div className="flex flex-col text-lg sm:text-2xl font-light text-start">
                <span>Nail polish</span>
                <span>colors</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-5 z-10 w-full lg:w-1/2">
          <div className="w-1/2">
            <Image
              src={'/temp/services/bridal_makeup.jpg'}
              alt=""
              width={1000}
              height={1000}
              className="w-full max-w-[450px] h-[260px] md:h-[450px] object-cover transition duration-200"
            />
          </div>
          <div className="w-1/2">
            <Image
              src={'/temp/services/luxury.jpeg'}
              alt=""
              width={1000}
              height={1000}
              className="w-full max-w-[450px] h-[260px] md:h-[450px] object-cover transition duration-200"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Aboutsection;
