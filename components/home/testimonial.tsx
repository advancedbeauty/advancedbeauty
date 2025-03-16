'use client';

import React, { useEffect, useRef, useState } from 'react';
import Heading from '../ui/features/Heading';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';
import Testimonialcard from './testimonialcard';
import data from '@/lib/data';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const Testimonialsection = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayDelay = 5000;
  const progressTimerRef = useRef<number | null>(null);

  // Setup autoplay plugin
  const autoplayPlugin = useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      playOnInit: true,
    }),
  );

  // Handle slide selection and tracking
  useEffect(() => {
    if (!api) return;

    // Set initial slide
    setCurrent(api.selectedScrollSnap());

    // Track slide changes
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Progress timer effect
  useEffect(() => {
    // Clear existing timer
    if (progressTimerRef.current !== null) {
      window.cancelAnimationFrame(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (!api || !isPlaying) return;

    let startTime: number | null = null;

    const updateProgress = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / autoplayDelay) * 100, 100);

      if (newProgress < 100) {
        progressTimerRef.current = window.requestAnimationFrame(updateProgress);
      } else {
        // When progress reaches 100%, move to next slide
        startTime = null;

        // Small delay to show completed circle before transition
        setTimeout(() => {
          if (api) {
            api.scrollNext();
          }
        }, 50);
      }
    };

    progressTimerRef.current = window.requestAnimationFrame(updateProgress);

    return () => {
      if (progressTimerRef.current !== null) {
        window.cancelAnimationFrame(progressTimerRef.current);
      }
    };
  }, [api, current, isPlaying, autoplayDelay]);

  // Mouse event handlers
  const handleMouseEnter = React.useCallback(() => {
    setIsPlaying(false);
    autoplayPlugin.current.stop();
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsPlaying(true);
    autoplayPlugin.current.play();
  }, []);

  return (
    <Section className="py-10 lg:py-14 bg-[#FBF1EA]">
      <Container className="w-full flex flex-col items-center justify-center relative text-center px-4 sm:px-6 lg:px-8">
        <Heading text="testimonials" />
        <div className="w-full mt-10 lg:mt-14">
          <Carousel
            dir="ltr"
            className="w-full"
            plugins={[autoplayPlugin.current]}
            opts={{
              loop: true,
              align: 'start',
              containScroll: 'trimSnaps',
              skipSnaps: false,
              slidesToScroll: 1,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            setApi={setApi}
          >
            <CarouselContent className="pb-4">
              {data.TestimonialData.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4 md:basis-1/3"
                >
                  <Testimonialcard
                    name={review.name}
                    review={review.review}
                    rating={review.rating}
                    image={review.image}
                    reviewDate={review.reviewDate}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="mt-7 text-sm flex flex-col items-center">
          <span>
            <strong>Google</strong> rating score: <strong>4.9</strong> of 5,
          </span>
          <span>
            based on <strong>186 reviews</strong>
          </span>
        </div>
      </Container>
    </Section>
  );
};

export default Testimonialsection;
