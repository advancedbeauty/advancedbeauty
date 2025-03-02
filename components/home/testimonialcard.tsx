'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialcardProps {
  name: string;
  review: string;
  rating: number;
  image: string;
  reviewDate: string;
}

const Testimonialcard: React.FC<TestimonialcardProps> = ({
  name,
  review,
  rating,
  image,
  reviewDate,
}) => {
  return (
    <div className="bg-[#fdf9f4] rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex items-center mb-4 justify-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <h3 className="font-bold text-lg">{name}</h3>
      </div>
      <p className="text-gray-700 flex-grow mb-4">{review}</p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${
                i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">Reviewed on {reviewDate}</span>
      </div>
    </div>
  );
};

export default Testimonialcard;
