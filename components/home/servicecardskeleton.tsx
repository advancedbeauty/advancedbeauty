'use client';

import React from 'react';

const ServiceCardSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Image skeleton */}
      <div className="relative overflow-hidden h-[230px] bg-gray-200 shadow-md rounded">
        <div className="absolute top-2 left-2 bg-gray-300 w-16 h-8 rounded"></div>
        <div className="absolute top-3 right-3 bg-gray-300 w-8 h-8 rounded-full"></div>
      </div>

      {/* Content skeleton */}
      <div className="w-full flex flex-col items-center justify-center py-4 gap-2">
        {/* Category */}
        <div className="h-4 bg-gray-200 rounded w-20"></div>

        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>

        {/* Price */}
        <div className="flex gap-5">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
