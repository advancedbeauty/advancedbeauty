'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Section from '@/components/ui/features/Section';
import Container from '@/components/ui/features/Container';
import Heading from '@/components/ui/features/Heading';
import { getServices } from '@/actions/service.action';
import ServiceCard from '@/components/home/servicecard';
import ServiceCardSkeleton from '@/components/home/servicecardskeleton';
import { usePathname } from 'next/navigation';
import { slugToTitle } from '@/lib/utils';

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

type ServiceResponse = {
  success: boolean;
  data: Service[];
  error?: string;
};

const LIMIT = 10;

const Categorycard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const category = slugToTitle(pathname.split('/')[2]);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const result = (await getServices(category, page, LIMIT)) as ServiceResponse;

      if (result.success) {
        // Deduplicate services
        setServices((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newServices = result.data.filter((s) => !existingIds.has(s.id));
          return [...prev, ...newServices];
        });

        if (result.data.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Observer setup for infinite scroll
  const observeLastItem = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const skeletonItems = Array(5)
    .fill(0)
    .map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 mt-10"
      >
        <ServiceCardSkeleton />
      </div>
    ));

  return (
    <Section className="py-10 lg:py-14">
      <Container className="w-full">
        <div className="flex justify-center items-center gap-5 flex-wrap">
          {category.split(' ').map((word, index) => (
            <Heading key={index} text={word} />
          ))}
        </div>

        <div className="w-full flex flex-wrap">
          {services.map((service, index) => {
            const isLast = index === services.length - 1;
            return (
              <div
                key={service.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 mt-10"
                ref={isLast ? observeLastItem : null}
              >
                <ServiceCard
                  src={service.images?.[0] || '/logo/logo.png'}
                  title={service.name}
                  price={service.price}
                  listingPrice={service.listPrice}
                  listingId={service.id}
                  category={service.category}
                />
              </div>
            );
          })}
          {loading && skeletonItems}
        </div>
      </Container>
    </Section>
  );
};

export default Categorycard;
