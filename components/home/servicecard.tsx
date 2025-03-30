'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toSlug } from '@/lib/utils';
// import HeartButton from '@/components/wishlist/heart-btn';

interface ServiceCardProps {
  src?: string;
  title: string;
  price: number;
  listingPrice: number;
  category: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  src,
  title,
  price,
  listingPrice,
  category,
}) => {
  const discountPercentage = Math.round(((price - listingPrice) / price) * 100);
  return (
    <div className="w-full">
      <div className="relative overflow-hidden h-[230px] shadow-md">
        <div className="w-full h-full">
          <Link href={`/services/${toSlug(category)}/${toSlug(title)}`} className="block w-full h-full">
            <div className="w-full h-full relative">
              <Image
                fill
                src={src || '/SLIDE_01.jpg'}
                alt={title}
                className="object-cover hover:scale-110 transition-all ease-in-out duration-300 select-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        </div>
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-yellow-100 text-black text-sm font-semibold rounded w-fit h-8 flex items-center justify-center shadow-lg z-10 px-2">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          {/* <HeartButton listingId={id} /> */}
        </div>
      </div>
      <div className="w-full flex flex-col items-center justify-center py-4 gap-2">
        <Link href={``} className="text-xs uppercase hover:underline">
          {category}
        </Link>
        <Link
          href={``}
          className="uppercase underline font-semibold text-lg text-center px-2"
        >
          {title}
        </Link>
        <div className="flex gap-5">
          {price && (
            <s className="text-neutral-400">
              <span className="uppercase font-semibold text-lg">₹{price}</span>
            </s>
          )}
          <span className="uppercase font-semibold text-lg text-red-700">
            ₹{listingPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
