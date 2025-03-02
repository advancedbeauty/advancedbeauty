'use client';

import * as React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import Link from 'next/link';

const Herosection = ({ items }: { items: {
  title: string;
  url: string;
  image: string;
}[] }) => {
  const [api, setApi] = React.useState<any>(null);
  const [current, setCurrent] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const autoplayDelay = 3000;
  const progressTimerRef = React.useRef<number | null>(null);

  // Setup autoplay plugin
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      playOnInit: true,
    })
  );

  // Handle slide selection and tracking
  React.useEffect(() => {
    if (!api) return;

    // Set initial slide
    setCurrent(api.selectedScrollSnap());

    // Track slide changes
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setProgress(0);
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  // Progress timer effect
  React.useEffect(() => {
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

      setProgress(newProgress);

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

  // Dot click handler
  const handleDotClick = React.useCallback((index: number) => {
    if (!api) return;

    // Temporarily stop autoplay and progress
    setIsPlaying(false);
    autoplayPlugin.current.stop();

    // Navigate to the clicked slide
    api.scrollTo(index);
    setCurrent(index);
    setProgress(0);

    // Resume after a short delay
    setTimeout(() => {
      setIsPlaying(true);
      autoplayPlugin.current.play();
    }, 100);
  }, [api]);

  // Calculate SVG circle properties
  const getCirclePath = (percent: number) => {
    const radius = 5;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (percent / 100) * circumference;

    return {
      strokeDasharray: `${circumference}`,
      strokeDashoffset: `${dashoffset}`
    };
  };

  return (
    <div className="relative">
      <Carousel
        dir="ltr"
        className="w-full mx-auto"
        plugins={[autoplayPlugin.current]}
        opts={{
          loop: true,
          align: 'start',
          containScroll: 'trimSnaps',
          skipSnaps: false
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={`slide-${index}`}>
              <Link href={item.url}>
                <div className="flex aspect-[16/6.5] items-center justify-center p-6 relative -m-1">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Timer rings positioned at bottom right */}
      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 flex gap-1 sm:gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center p-0 bg-transparent border-0 focus:outline-none"
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index ? 'true' : 'false'}
          >
            {/* Background circle */}
            <svg width="12" height="12" viewBox="0 0 12 12" className="absolute">
              <circle
                cx="6"
                cy="6"
                r="5"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Progress circle */}
            <svg width="12" height="12" viewBox="0 0 12 12" className="absolute">
              <circle
                cx="6"
                cy="6"
                r="5"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                transform="rotate(-90 6 6)"
                style={index === current ? getCirclePath(progress) : getCirclePath(0)}
              />
            </svg>

            {/* Small dot indicator for current slide */}
            {index === current && (
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white absolute" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Herosection;