"use client";

import React, { useEffect, useState } from "react";
import CartItemsDetails from "./CartItemsDetails";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Loader from "../others/Loader";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/store/hooks/useCart";
import { CreditCard, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/store/context/AuthContext";

const OrderSummaryForCheckout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "">("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    dispatch,
    cartItems,
    getTotalPrice,
    getTax,
    getShippingFee,
    getTotalAmount,
  } = useCart();

  const { user } = useAuth();
  const router = useRouter();


  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <Loader />;

  /* ================= PLACE ORDER ================= */
/* ================= PLACE ORDER ================= */
const handlePlaceOrder = async () => {
  // 🔐 Auth check
  if (!user) {
    toast.error("Please login to continue");
    router.push("/login?redirect=/checkout");
    return;
  }

  // 🛒 Cart validation
  if (!cartItems || cartItems.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  // 💳 Payment validation
  if (!paymentMethod) {
    toast.error("Please select a payment method");
    return;
  }

  setIsPlacingOrder(true);

  try {
    if (paymentMethod === "cod") {
      // ✅ STEP 1: (Later) call createOrder API here
      // await createOrder(cartItems);

      // ✅ STEP 2: CLEAR CART (IMPORTANT)
      dispatch({ type: "CLEAR_CART" });

      toast.success("Order placed successfully 🎉");

      // ✅ STEP 3: Redirect
      router.push("/success");
    } else {
      toast.success("Redirecting to payment gateway…");
      // Razorpay / Stripe flow
    }
  } catch (err) {
    toast.error("Failed to place order");
  } finally {
    setIsPlacingOrder(false);
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
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-3">
          <span>Subtotal:</span>
          <span>₹{formatPrice(getTotalPrice())}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>Shipping:</span>
          <span>₹{formatPrice(getShippingFee())}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>Tax:</span>
          <span>₹{formatPrice(getTax())}</span>
        </div>

        <Separator className="my-3" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>₹{formatPrice(getTotalAmount())}</span>
        </div>

        {/* PAYMENT METHOD */}
        <h3 className="text-lg font-semibold mt-6 mb-3">
          Select Payment Method
        </h3>

        <div className="space-y-3">
          {/* COD */}
          <div
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
              paymentMethod === "cod"
                ? "border-green-600 bg-green-100"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            <Truck className="text-green-700" />
            <span className="font-medium">Cash on Delivery (COD)</span>
          </div>

          {/* ONLINE */}
          <div
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
              paymentMethod === "online"
                ? "border-green-600 bg-green-100"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("online")}
          >
            <CreditCard className="text-green-700" />
            <span className="font-medium">
              Online Payment (UPI / Card / Net Banking)
            </span>
          </div>
        </div>

        {/* PLACE ORDER */}
        <Button
          disabled={isPlacingOrder}
          className="w-full text-xl mt-6 bg-[#063E09] text-white py-4 rounded-full"
          onClick={handlePlaceOrder}
        >
          {isPlacingOrder ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummaryForCheckout;
