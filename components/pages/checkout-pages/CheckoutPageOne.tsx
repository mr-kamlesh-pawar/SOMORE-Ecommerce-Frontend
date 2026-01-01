"use client"
import OrderSummaryForCheckout from "@/components/carts/OrderSummaryForCheckout";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import CheckoutAddress from "./CheckoutAddress";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/AuthContext";
import CheckoutLoader from "@/components/skeleton/CheckoutLoader";

const CheckoutPageOne = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [addressSelected, setAddressSelected] = useState(false);

  // 🔐 Protect checkout
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, loading, router]);

  // Check if address is selected from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('selectedAddress');
    if (savedAddress) {
      try {
        JSON.parse(savedAddress);
        setAddressSelected(true);
      } catch (e) {
        // Invalid JSON
      }
    }
  }, []);

  if (loading || !user) {
    return <CheckoutLoader />;
  }

  return (
    <section className="px-4 py-4 lg:px-16 bg-white dark:bg-gray-800 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
            </li>
            <li className="text-gray-400">›</li>
            <li>
              <a href="/cart" className="text-gray-500 hover:text-gray-700">Cart</a>
            </li>
            <li className="text-gray-400">›</li>
            <li>
              <a href="/checkout/address" className="text-gray-500 hover:text-gray-700">Address</a>
            </li>
            <li className="text-gray-400">›</li>
            <li className="text-gray-900 font-medium">Checkout</li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Checkout
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              Cart
            </span>
            <span className="text-gray-400">→</span>
            
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              Address
            </span>
            <span className="text-gray-400">→</span>


            <span className="flex items-center gap-1">
               <div className={`w-2 h-2 rounded-full ${addressSelected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              Checkout
            </span>


            <span className="text-gray-400">→</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              Success
            </span>
          </div>
          <Separator className="dark:bg-white/50 mt-4" />
        </div>

           
        
        



          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24">
            <OrderSummaryForCheckout />
          </div>
       

        {/* Footer Information */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-medium text-gray-900 dark:text-white">Secure Payment</h4>
              <p className="text-sm text-gray-600 mt-1">Your payment information is encrypted</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-medium text-gray-900 dark:text-white">Easy Returns</h4>
              <p className="text-sm text-gray-600 mt-1">30-day return policy</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📞</div>
              <h4 className="font-medium text-gray-900 dark:text-white">24/7 Support</h4>
              <p className="text-sm text-gray-600 mt-1">Call 1800-123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPageOne;