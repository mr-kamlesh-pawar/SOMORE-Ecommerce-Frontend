"use client"
import OrderSummaryForCheckout from "@/components/carts/OrderSummaryForCheckout";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import CheckoutAddress from "@/components/pages/checkout-pages/CheckoutAddress";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/AuthContext";
import CheckoutLoader from "@/components/skeleton/CheckoutLoader";

const CheckoutAddressPage = () => {
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
                
                <li className="text-gray-900 font-medium">Address</li>
              </ol>
            </nav>
    
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Select Delivery Address
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  Cart
                </span>
                <span className="text-gray-400">→</span>
                
                <span className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${addressSelected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  Address
                </span>
                <span className="text-gray-400">→</span>
    
    
                <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
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
    
               
            
    
                  <div>
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            Shipping Address
                          </h2>
                          <p className="text-sm text-gray-500">
                            {addressSelected 
                              ? "Address selected ✓" 
                              : "Please select or add a shipping address"}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${addressSelected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {addressSelected ? 'Ready' : 'Required'}
                        </div>
                      </div>
                      <CheckoutAddress onAddressSelect={() => setAddressSelected(true)} />
                    </div>
        
                    {/* Shipping Information */}
                    <div className="mt-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Shipping Information</h3>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <div className="text-green-600 mt-0.5">✓</div>
                          <span>Free shipping on orders over ₹499</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-green-600 mt-0.5">✓</div>
                          <span>2-4 business days delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-green-600 mt-0.5">✓</div>
                          <span>Cash on delivery available</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="text-green-600 mt-0.5">✓</div>
                          <span>Track your order via SMS & Email</span>
                        </li>
                      </ul>
                    </div>
                  </div>
        
        </div>
        </section>
       
   
  )
}

export default CheckoutAddressPage