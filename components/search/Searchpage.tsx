'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ServiceCategoryData, ServiceCategory } from '@/lib/data';
import { searchServices } from '@/actions/search.action';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@prisma/client';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui/skeleton';
import Section from '../ui/features/Section';
import Container from '../ui/features/Container';
import { Search } from 'lucide-react';
import ServiceCard from '../home/servicecard';

const Searchpage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await searchServices(debouncedSearch);
        if (error) throw new Error(error);
        setServices(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [debouncedSearch]);

  return (
    <Section className="py-10 md:py-16">
      <Container className="w-full max-w-7xl mx-auto">
        <div className="mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pl-2 sm:pl-4">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-black" />
          </div>
          <Input
            type="search"
            placeholder="Search services..."
            className="border-b-2 border-black shadow-none border-x-0 border-t-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-black focus:border-gray-900 focus:border-b-2 focus:border-x-0 focus:border-t-0 text-lg sm:text-xl md:text-2xl lg:text-3xl p-2 sm:p-3 md:p-4 lg:p-5 pl-10 sm:pl-14 md:pl-16 lg:pl-20 transition-all outline-none "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery ? (
          <>
            {/* Service Categories */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-8">
                Service Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ServiceCategoryData.filter((category) =>
                  category.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                ).map((category: ServiceCategory) => (
                  <Link href={category.url} key={category.id}>
                    <div className="relative group rounded-xl overflow-hidden shadow-md h-[200px]">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h3 className="text-white text-xl font-medium text-center px-2">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Service Items */}
            <div>
              <h2 className="text-2xl font-semibold mb-8">Services</h2>
              {error && (
                <div className="text-red-500 text-center py-4">{error}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {loading ? (
                  Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-[230px] w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                        <Skeleton className="h-4 w-1/4 mx-auto" />
                      </div>
                    ))
                ) : services.length > 0 ? (
                  services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      src={service.images[0]}
                      title={service.name}
                      price={service.price * 1.2}
                      listingPrice={service.price}
                      listingId={service.id}
                      category={service.category}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-12 text-lg">
                    No services found. Try adjusting your search.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12 text-lg">
            Start typing to see categories and services...
          </div>
        )}
      </Container>
    </Section>
  );
};

export default Searchpage;
