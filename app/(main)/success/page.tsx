// app/success/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCart } from '@/store/hooks/useCart';

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dispatch } = useCart();
  
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');
  
  const [countdown, setCountdown] = useState(10);

  // Clear cart on success page load (as backup)
  useEffect(() => {
    dispatch({ type: "CLEAR_CART" });
  }, [dispatch]);

  // Countdown timer for automatic redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed! 🎉
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Order Number:</span>
            </div>
            <span className="font-semibold text-gray-900">
              #{orderNumber || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Order ID:</span>
            </div>
            <span className="font-semibold text-gray-900">
              {orderId?.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Order Status Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            <strong>What's next?</strong> We've sent you an email confirmation. 
            Your order will be processed and shipped within 24-48 hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            asChild
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-xl"
          >
            <Link href="/orders">
              <Package className="w-5 h-5 mr-2" />
              View My Orders
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full py-6 text-lg rounded-xl"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Countdown Timer */}
        <p className="text-gray-500 text-sm mt-8">
          Redirecting to home in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;