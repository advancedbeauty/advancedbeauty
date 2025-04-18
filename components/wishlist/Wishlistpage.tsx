'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';
import Heading from '@/components/ui/features/Heading';
import ServiceCard from '@/components/home/servicecard';
import ServiceCardSkeleton from '@/components/home/servicecardskeleton';
import { FaRegHeart } from 'react-icons/fa';
import Link from 'next/link';
import { getWishlistItems } from '@/actions/wishlist.action';
import { getWishlistServices } from '@/actions/service.action';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

// Define the service type
type Service = {
  id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
  description: string | null;
  price: number;
  listPrice: number;
  tags: string[];
  avgRating?: number;
};

const WishlistPage = () => {
  const { data: session, status } = useSession();
  const [wishlistedServices, setWishlistedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth?callbackUrl=/wishlist');
    }
  }, [status]);

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
    if (autoplayPlugin.current) {
      autoplayPlugin.current.stop();
    }
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsPlaying(true);
    if (autoplayPlugin.current) {
      autoplayPlugin.current.play();
    }
  }, []);

  // Fetch wishlisted services
  useEffect(() => {
    const fetchWishlistedServices = async () => {
      if (status === 'loading' || !session?.user) return;

      try {
        setLoading(true);

        // Step 1: Get the wishlist IDs using your existing action
        const wishlistResult = await getWishlistItems(session.user.id);

        if (!wishlistResult.success || !wishlistResult.data) {
          console.error('Error fetching wishlist IDs:', wishlistResult.error);
          setLoading(false);
          return;
        }

        const wishlistIds = wishlistResult.data;

        if (wishlistIds.length === 0) {
          setWishlistedServices([]);
          setLoading(false);
          return;
        }

        // Step 2: Get the service details for each wishlist ID using the new server action
        const servicesResult = await getWishlistServices(wishlistIds);

        if (servicesResult.success && servicesResult.services) {
          setWishlistedServices(servicesResult.services);
        } else {
          console.error(
            'Error fetching service details:',
            servicesResult.error,
          );
        }
      } catch (error) {
        console.error('Error in wishlist fetch process:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistedServices();
  }, [session, status]);

  // Generate skeleton cards while loading
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

  // Empty wishlist view
  const EmptyWishlist = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <FaRegHeart className="text-6xl text-neutral-300 mb-4" />
      <h3 className="text-2xl font-bold mb-2">Your wishlist is empty</h3>
      <p className="text-neutral-500 mb-6 max-w-md">
        Start adding services to your wishlist by clicking the heart icon on any
        service.
      </p>
      <Link
        href="/services"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Browse Services
      </Link>
    </div>
  );

  return (
    <Section className="py-10 lg:py-14">
      <Container className="w-full">
        <div className="flex justify-center items-center gap-5">
          <Heading text="My" />
          <Heading text="Wishlist" />
        </div>

        {loading ? (
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
              <CarouselContent>{skeletonItems}</CarouselContent>
            </Carousel>
          </div>
        ) : wishlistedServices.length === 0 ? (
          <EmptyWishlist />
        ) : (
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
              <CarouselContent>
                {wishlistedServices.map((service) => (
                  <CarouselItem
                    key={service.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4 md:basis-1/3 xl:basis-1/5"
                  >
                    <ServiceCard
                      src={service.images?.[0] || '/logo/logo.png'}
                      title={service.name}
                      price={service.price}
                      listingPrice={service.listPrice}
                      category={service.category}
                      listingId={service.id}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </Container>
    </Section>
  );
};

export default WishlistPage;