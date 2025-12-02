"use client";
import { Minus, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/store/hooks/useCart";
import { CartItem } from "@/store/context/CartContext";

const CartItemsDetails = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { cartItems, dispatch } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-xl text-center p-2 lg:col-span-2">
        Sorry, No Item Found In The Cart
      </div>
    );
  }

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return; // safety check
    dispatch({
      type: "UPDATE_QTY",
      payload: { id, quantity: qty },
    });
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <div className="lg:col-span-2">
      {cartItems.map((item: CartItem) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 dark:border-gray-500 py-4"
        >
          {/* IMAGE + NAME */}
          <div className="flex items-center space-x-4">
            <Image
              src={item.images?.[0] ?? "/placeholder.png"}
              alt={item.name ?? "Product"}
              height={74}
              width={74}
              className="w-20 h-20 rounded-lg object-cover"
            />

            <Link
              href={`/shop/${item.slug}`}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:opacity-60"
            >
             <p> {(item.name ?? "").slice(0, 38)}</p>
             <p> {(item.name ?? "").slice(38, 100)}</p>
             
            </Link>
          </div>

          {/* PRICE */}
          <p className="border rounded-md bg-[#046b09] py-1 px-2 text-xl text-white">
            ₹{formatPrice(item.price)}
          </p>

          {/* QUANTITY SECTION */}
          <div className="flex items-center gap-2">
            <Button
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              size="sm"
              variant="outline"
            >
              <Minus />
            </Button>

            <p className="font-medium">{item.quantity}</p>

            <Button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              size="sm"
              variant="outline"
            >
              <Plus />
            </Button>
          </div>

          {/* REMOVE BUTTON */}
          <div>
            <Button
              onClick={() => removeFromCart(item.id)}
              variant="destructive"
            >
              <X />
            </Button>
          </div>
        </div>
      ))}

      {/* CLEAR CART BUTTON */}
      {cartItems.length > 0 && (
        <Button variant="outline" className="my-2" onClick={clearCart}>
          Clear Cart
        </Button>
      )}
    </div>
  );
};

export default CartItemsDetails;
