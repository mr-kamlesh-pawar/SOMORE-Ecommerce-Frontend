// components/skeletons/CheckoutLoader.tsx
import React from 'react';

const CheckoutLoader = () => {
  return (
    <section className="px-4 py-4 lg:px-16 bg-white dark:bg-gray-800 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        {/* Breadcrumb Skeleton */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        </nav>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${
                  i === 1 ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-700'
                } animate-pulse`}></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                {i < 3 && (
                  <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
          <div className="h-px bg-gray-200 dark:bg-gray-700 mt-6 animate-pulse"></div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address Section */}
          <div>
            {/* Address Card Skeleton */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-green-200 dark:bg-green-900 rounded-full"></div>
              </div>

              {/* Address List Skeleton */}
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button Skeleton */}
              <div className="mt-8">
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            {/* Shipping Info Skeleton */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full mt-0.5"></div>
                    <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary Skeleton */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm animate-pulse">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-7 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              {/* Order Items Skeleton */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-20 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex justify-between">
                          <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
              </div>

              {/* Address Preview Skeleton */}
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              {/* Order Summary Skeleton */}
              <div className="mb-6">
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  {['Subtotal', 'Shipping', 'Tax'].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                      <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-3"></div>
                  <div className="flex justify-between">
                    <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-24 bg-green-300 dark:bg-green-700 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Payment Method Skeleton */}
              <div className="mb-6">
                <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Place Order Button Skeleton */}
              <div className="mt-8">
                <div className="h-14 w-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 rounded-xl"></div>
              </div>

              {/* Security Note Skeleton */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Information Skeleton */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto mb-3"></div>
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-2"></div>
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutLoader;