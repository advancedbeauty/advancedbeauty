import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ServiceCardProps {
  src: string;
  alt: string;
  href?: string;
  title?: string;
  isLoading?: boolean;
}

const ServiceCard = ({
  src,
  alt,
  href,
  title,
  isLoading = false,
}: ServiceCardProps) => {
  if (isLoading) {
    return <LoadingServiceCard />;
  }

  const hrefs = href || '';

  return (
    <Link href={hrefs} className="group w-full">
      <div className="relative w-full rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="aspect-video relative">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        {title && (
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg sm:text-xl font-semibold group-hover:underline capitalize">
              {title}
            </h3>
          </div>
        )}
      </div>
    </Link>
  );
};

const LoadingServiceCard = () => {
  return (
    <div className="w-full">
      <div className="relative rounded-lg overflow-hidden animate-pulse">
        <div className="aspect-video bg-gray-200" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 w-32 h-6 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default ServiceCard;
