import React from 'react';

const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-[1500px] mx-auto px-4 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Image Gallery Skeleton */}
        <div>
          {/* Main Image */}
          <div className="w-full aspect-square rounded-xl bg-gray-300"></div>
          
          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-24 h-24 rounded-xl bg-gray-200"
              ></div>
            ))}
          </div>
        </div>

        {/* Right: Product Info Skeleton */}
        <div>
          {/* Title */}
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-5 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Price */}
          <div className="h-10 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

          {/* Stock Indicator */}
          <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Offer Box Skeleton */}
          <div className="mb-8">
            <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-20 bg-gray-100 rounded w-full"></div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-10">
            <div className="w-1/2 h-14 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-14 bg-gray-300 rounded"></div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-11/12"></div>
            <div className="h-4 bg-gray-200 rounded w-10/12"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-9/12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;