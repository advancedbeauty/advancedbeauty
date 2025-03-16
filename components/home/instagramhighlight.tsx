'use client';

import React, { useEffect, useRef, useState } from 'react';
import Section from '../ui/features/Section';
import Heading from '../ui/features/Heading';
import Container from '../ui/features/Container';
import InstagramPost from './instagrampost';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import data from '@/lib/data';

const InstagramHighlight = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const autoplayDelay = 3000;
  const progressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (progressTimerRef.current !== null) {
      window.cancelAnimationFrame(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (!api) return;

    let startTime: number | null = null;

    const updateProgress = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      if (elapsed < autoplayDelay) {
        progressTimerRef.current = window.requestAnimationFrame(updateProgress);
      } else {
        startTime = null;

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
  }, [api, current, autoplayDelay]);

  return (
    <Section className="py-10 md:py-14">
      <Container className="w-full flex flex-col items-center justify-center relative text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-5">
          <Heading text="instagram" />
          <Heading text="highlights" />
        </div>
        <div className="w-full mt-10 lg:mt-14">
          <Carousel
            dir="ltr"
            className="w-full"
            opts={{
              loop: true,
              align: 'start',
              containScroll: 'trimSnaps',
              skipSnaps: false,
              slidesToScroll: 1,
            }}
            setApi={setApi}
          >
            <CarouselContent className="flex gap-2">
              {data.InstagramData.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="flex items-center justify-center h-full">
                    <InstagramPost postUrl={post.url} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </Container>
    </Section>
  );
};

export default InstagramHighlight;
