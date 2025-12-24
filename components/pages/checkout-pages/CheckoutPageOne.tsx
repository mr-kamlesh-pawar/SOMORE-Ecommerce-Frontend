"use client"
import OrderSummaryForCheckout from "@/components/carts/OrderSummaryForCheckout";
import CheckoutForm from "@/components/forms/CheckoutForm";
import CouponCodeForm from "@/components/forms/CouponCodeForm";
import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import CheckoutAddress from "./CheckoutAddress";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/AuthContext";

const CheckoutPageOne = () => {

   const { user, loading } = useAuth();
  const router = useRouter();

  // 🔐 Protect checkout
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <section className="px-4 py-4 lg:px-16  bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white ">
            Checkout
          </h1>
          <p>Please fill out the address form if you haven&apos;t save it</p>
          <Separator className="dark:bg-white/50 mt-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Address
              </h2>
            <CheckoutAddress />
            </div>
             
          </div>
          {/* Order Summary */}
          <OrderSummaryForCheckout />
        </div>
      </div>
    </section>
  );
};

export default CheckoutPageOne;
