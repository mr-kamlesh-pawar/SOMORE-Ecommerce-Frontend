"use client";

import React, { useEffect, useState } from "react";
import CartItemsDetails from "./CartItemsDetails";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Loader from "../others/Loader";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/store/hooks/useCart";
import { CreditCard, Wallet, Truck } from "lucide-react";
import { useRouter } from "next/navigation";


const OrderSummaryForCheckout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "">("");

  const { getTotalPrice, getTax, getShippingFee, getTotalAmount } = useCart();

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <Loader />;

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (paymentMethod === "cod") {
      router.push("/success");
    } else {
      alert("Redirecting to Online Payment Gateway…");
      // redirect("/payment") or integrate Razorpay
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      {/* ORDER ITEMS */}
      <div>
        <h2 className="text-lg font-semibold my-2 lg:p-4">Order Items</h2>
        <CartItemsDetails />
        <Separator className="dark:bg-white/50 mb-2" />
      </div>

      {/* ORDER SUMMARY */}
      <div className="lg:px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h2>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">
            ₹{formatPrice(getTotalPrice())}
          </span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
          <span className="text-gray-900 dark:text-white">
            ₹{formatPrice(getShippingFee())}
          </span>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Tax:</span>
          <span className="text-gray-900 dark:text-white">
            ₹{formatPrice(getTax())}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Total:
          </span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            ₹{formatPrice(getTotalAmount())}
          </span>
        </div>

        {/* PAYMENT METHOD */}
        <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
          Select Payment Method
        </h3>

        <div className="space-y-3">

          {/* COD */}
          <div
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
              paymentMethod === "cod"
                ? "border-green-600 bg-green-100"
                : "border-gray-300 dark:border-gray-500"
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            <Truck className="text-green-700" />
            <span className="text-gray-900 dark:text-white font-medium">
              Cash on Delivery (COD)
            </span>
          </div>

          {/* ONLINE PAYMENT */}
          <div
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
              paymentMethod === "online"
                ? "border-green-600 bg-green-100"
                : "border-gray-300 dark:border-gray-500"
            }`}
            onClick={() => setPaymentMethod("online")}
          >
            <CreditCard className="text-green-700" />
            <span className="text-gray-900 dark:text-white font-medium">
              Online Payment (UPI / Card / Net Banking)
            </span>
          </div>
        </div>

        {/* PLACE ORDER BUTTON */}
        <Button
          className="w-full text-xl mt-6 bg-[#063E09] dark:bg-[#0c7b11] text-white py-4 rounded-full hover:bg-[#07760c] transition"
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default OrderSummaryForCheckout;
