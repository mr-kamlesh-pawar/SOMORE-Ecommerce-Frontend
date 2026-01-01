// components/skeletons/OrderSummarySkeleton.tsx
import React from 'react';
import { Separator } from '@/components/ui/separator';

const OrderSummarySkeleton = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg animate-pulse">
      {/* ORDER ITEMS SECTION */}
      <div className="mb-8">
        <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
        <div className="space-y-4">
          {/* Cart Item 1 */}
          <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>
            </div>
          </div>
          {/* Cart Item 2 */}
          <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-6 dark:bg-gray-600" />
      </div>

      {/* ADDRESS SECTION */}
      <div className="mb-8">
        <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-56 mb-4"></div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mt-4"></div>
        </div>
      </div>

      {/* ORDER SUMMARY SECTION */}
      <div>
        <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4"></div>
        
        <div className="space-y-4 mb-6">
          {/* Subtotal */}
          <div className="flex justify-between">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
          {/* Shipping */}
          <div className="flex justify-between">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          {/* Tax */}
          <div className="flex justify-between">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <Separator className="my-4 dark:bg-gray-600" />
          {/* Total */}
          <div className="flex justify-between">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
        </div>

        {/* PAYMENT METHOD SECTION */}
        <div className="mt-8">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-4"></div>
          
          <div className="space-y-4">
            {/* COD Option */}
            <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                </div>
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>

            {/* Online Payment Option */}
            <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56"></div>
                </div>
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* PLACE ORDER BUTTON */}
        <div className="mt-8">
          <div className="w-full h-14 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          
          {/* Security Note */}
          <div className="mt-4 text-center">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummarySkeleton;