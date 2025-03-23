'use client';

import React, { useState, useEffect, useRef } from 'react';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import Heading from '../ui/features/Heading';
import { getTrendingServices } from '@/actions/service.action';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import ServiceCard from './servicecard';
import ServiceCardSkeleton from './servicecardskeleton';

// Define the service type based on the error message
type Service = {
  name: string;
  id: string;
  slug: string;
  category: string;
  images: string[];
  description: string | null;
  price: number;
  listPrice: number;
  tags: string[];
  avgRating: number;
};

// Define the response type from getTrendingServices
type ServiceResponse = {
  success: boolean;
  data: Service[];
  error?: string;
};

const TrendingServices = () => {
  // Initialize state with proper types
  const [services, setServices] = useState<Service[]>([]);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = (await getTrendingServices()) as ServiceResponse;

        if (result.success) {
          setServices(result.data);
        }
      } catch (error) {
        console.error('Error fetching trending services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const skeletonItems = Array(5)
    .fill(0)
    .map((_, index) => (
      <CarouselItem
        key={`skeleton-${index}`}
        className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4 md:basis-1/3 xl:basis-1/5"
      >
        <ServiceCardSkeleton />
      </CarouselItem>
    ));

  return (
    <Section className="py-10 lg:py-14">
      <Container className="w-full">
        <div className="flex justify-center items-center gap-5">
          <Heading text="Trending" />
          <Heading text="Services" />
        </div>
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
            <CarouselContent className="">
              {loading
                ? // Show skeletons while loading
                  skeletonItems
                : // Show actual services when loaded
                  services.map((service) => (
                    <CarouselItem
                      key={service.id}
                      className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4 md:basis-1/3 xl:basis-1/5"
                    >
                      <ServiceCard
                        src={service.images[0]}
                        title={service.name}
                        price={service.price}
                        listingPrice={service.listPrice}
                        category={service.category}
                      />
                    </CarouselItem>
                  ))}
            </CarouselContent>
          </Carousel>
        </div>
      </Container>
    </Section>
  );
};

export default TrendingServices;
