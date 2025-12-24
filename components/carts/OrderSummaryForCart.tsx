'use client'
import React, { useEffect, useState } from "react";
import CheckoutBtn from "../buttons/CheckoutBtn";
import useCartStore from "@/store/cartStore";
import Loader from "../others/Loader";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/store/hooks/useCart";

const OrderSummaryForCart = () => {

  const [isMounted, setIsMounted] = useState(false);
  const { getTotalPrice, getTax, getShippingFee, getTotalAmount, cartItems } = useCart();
  
  useEffect(() => {
     setIsMounted(true)
  },[])

  
  
  if(!isMounted){
    return <Loader />
  }

    const isCartEmpty = !cartItems || cartItems.length === 0;


  return (
    <div className="w-full shadow-md  bg-gray-100 dark:bg-gray-700 p-4 md:p-6 rounded-lg" >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h2>
      <div className="flex justify-between mb-4">
        <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
        <span className="text-gray-900 dark:text-white">₹{formatPrice(getTotalPrice())}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
        <span className="text-gray-900 dark:text-white">
           ₹{formatPrice(isCartEmpty ? 0 : getShippingFee())}

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
         ₹{formatPrice(isCartEmpty ? 0 : getTotalAmount())}
        </span>
      </div>
      <div className="w-fit mt-4">
      <CheckoutBtn disabled={isCartEmpty} />
      </div>
    </div>
  );
};

export default OrderSummaryForCart;
