"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import CartItemsDetails from "./CartItemsDetails";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/store/hooks/useCart"; 
import { CreditCard, Truck, MapPin, AlertCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/store/context/AuthContext";
import { createOrder } from "@/lib/order-service";
import OrderSummarySkeleton from "../skeleton/OrderSummarySkeleton";
import { CartItem } from "@/store/context/CartContext";

interface OrderCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId: string;
}

interface OrderData {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  address: string;
  paymentMethod: "cod" | "online";
  cartItems: OrderCartItem[];
  shippingCost: number;
  taxAmount: number;
  discountedAmount: number;
  totalAmount: number;
  notes: string;
}

interface Address {
  house: string;
  area: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mobileno: string;
  addressType: string;
  $id?: string;
}

const OrderSummaryForCheckout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "">("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [checkingAddress, setCheckingAddress] = useState(true);

  const {
    cartItems,
    getTotalPrice,
    getTax,
    getShippingFee,
    getTotalAmount,
    dispatch,
    getCartCount
  } = useCart();

  const { user } = useAuth();
  const router = useRouter();

  // Memoized calculations
  const cartCount = useMemo(() => getCartCount(), [getCartCount]);
  const canProceed = useMemo(() => {
    return cartCount > 0 && selectedAddress && paymentMethod && !isPlacingOrder;
  }, [cartCount, selectedAddress, paymentMethod, isPlacingOrder]);

  // Load selected address from localStorage with debounce
  useEffect(() => {
    setIsMounted(true);
    
    const loadAddress = () => {
      try {
        const savedAddress = localStorage.getItem('selectedAddress');
        if (savedAddress) {
          const parsedAddress = JSON.parse(savedAddress);
          setSelectedAddress(parsedAddress);
        }
      } catch (e) {
        console.error("Error parsing saved address:", e);
      } finally {
        setCheckingAddress(false);
      }
    };

    loadAddress();
  }, []);

  // If no address selected, redirect to address selection
  useEffect(() => {
    if (isMounted && !checkingAddress && !selectedAddress) {
      toast.error("Please select a shipping address");
      router.push('/checkout');
    }
  }, [isMounted, checkingAddress, selectedAddress, router]);

  // Update localStorage when address changes
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    }
  }, [selectedAddress]);

  // Validate cart items on mount
  useEffect(() => {
    if (cartCount === 0 && isMounted) {
     // toast.error("Your cart is empty");
      router.push('/cart');
    }
  }, [cartCount, isMounted, router]);

 

  const handlePlaceOrder = useCallback(async () => {
    // 🔐 Auth check
    if (!user) {
      toast.error("Please login to continue");
      router.push("/login?redirect=/checkout");
      return;
    }

    // 🏠 Address check
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      router.push('/checkout');
      return;
    }

    // 🛒 Cart validation
    if (cartCount === 0) {
      toast.error("Your cart is empty");
      router.push('/cart');
      return;
    }

    // 💳 Payment validation
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // 📞 Phone validation
    if (!selectedAddress.mobileno || selectedAddress.mobileno.length < 10) {
      toast.error("Please provide a valid phone number");
      return;
    }

    setIsPlacingOrder(true);
    const toastId = toast.loading("Creating your order...");

    try {
      // Prepare order data
      const orderData: OrderData = {
        userId: user.$id,
        customerName: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email.split('@')[0],
        customerEmail: user.email,
        customerPhone: user.profile?.phone || selectedAddress.mobileno,
        shippingAddress: selectedAddress,
        address: `${selectedAddress.house}, ${selectedAddress.area}, ${selectedAddress.city} - ${selectedAddress.pincode}`,
        paymentMethod,
        cartItems: cartItems.map((item: CartItem): OrderCartItem => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images && item.images.length > 0 ? item.images[0] : ""
        })),
        shippingCost: getShippingFee(),
        taxAmount: getTax(),
        discountedAmount: 0,
        totalAmount: getTotalAmount(),
        notes: ""
      };

      // Create order in database
      const result = await createOrder(orderData);

      if (result.success) {
        // Clear cart
        dispatch({ type: "CLEAR_CART" });
        
        // Clear selected address from localStorage
        localStorage.removeItem('selectedAddress');
        
        toast.success("Order placed successfully! 🎉", { id: toastId });
        
        // Redirect to success page with fade effect
        setTimeout(() => {
          router.push(`/success?orderId=${result.orderId}&orderNumber=${result.orderNumber}`);
        }, 800);
      } else {
        toast.error(result.error || "Failed to place order", { id: toastId });
      }
    } catch (error: any) {
      console.error("Order error:", error);
      const errorMessage = error.response?.message || error.message || "Failed to place order";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsPlacingOrder(false);
    }
  }, [user, selectedAddress, cartCount, paymentMethod, cartItems, getShippingFee, getTax, getTotalAmount, dispatch, router]);

   if (!isMounted || checkingAddress) {
    return <OrderSummarySkeleton />;
  }

  // Empty cart handler
  const handleEmptyCartRedirect = () => {
    toast("Add items to your cart to checkout", {
      icon: "🛒",
    });
    router.push('/products');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      {/* Order Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Order Summary
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck size={16} className="text-green-600" />
          <span>Secure checkout</span>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Order Items ({cartCount})</h3>
          <button
            onClick={() => router.push('/cart')}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Edit Cart
          </button>
        </div>
        {cartCount > 0 ? (
          <>
            <CartItemsDetails />
            <Separator className="my-4 dark:bg-gray-600" />
          </>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="text-gray-400 mb-2">🛒</div>
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={handleEmptyCartRedirect}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
            >
              Shop Products
            </button>
          </div>
        )}
      </div>

      {/* SELECTED ADDRESS */}
      {selectedAddress && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-green-600" size={18} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium">{selectedAddress.house}, {selectedAddress.area}</p>
            <p className="text-gray-600 dark:text-gray-400">{selectedAddress.addressLine}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-600 dark:text-gray-400">📞 {selectedAddress.mobileno}</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                {selectedAddress.addressType}
              </span>
            </div>
          </div>
          <button 
            onClick={() => router.push('/checkout/address')}
            className="text-sm text-green-600 font-medium mt-3 hover:text-green-700 flex items-center gap-1"
          >
            Change Address
          </button>
        </div>
      )}

      {/* ORDER SUMMARY */}
      {cartCount > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartCount} items):</span>
              <span className="font-medium">₹{formatPrice(getTotalPrice())}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
              <span className="font-medium">₹{formatPrice(getShippingFee())}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax (10%):</span>
              <span className="font-medium">₹{formatPrice(getTax())}</span>
            </div>

            <Separator className="my-3 dark:bg-gray-600" />

            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total Amount:</span>
              <span className="text-green-600">₹{formatPrice(getTotalAmount())}</span>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Method</h3>
            
            <div className="space-y-3">
              {/* COD */}
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className={`p-2 rounded-full ${paymentMethod === "cod" ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-700"}`}>
                  <Truck className={`${paymentMethod === "cod" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`} size={20} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Cash on Delivery (COD)</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive your order</p>
                </div>
                {paymentMethod === "cod" && (
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>

              {/* ONLINE PAYMENT */}
              <div
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "online"
                    ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onClick={() => setPaymentMethod("online")}
              >
                <div className={`p-2 rounded-full ${paymentMethod === "online" ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-700"}`}>
                  <CreditCard className={`${paymentMethod === "online" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`} size={20} />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Online Payment</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pay with UPI, Card, or Net Banking</p>
                </div>
                {paymentMethod === "online" && (
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Warning */}
            {paymentMethod === "cod" && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Cash on Delivery may have additional verification. Please keep your ID proof ready.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PLACE ORDER BUTTON */}
          <Button
            disabled={!canProceed}
            className="w-full text-lg mt-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 rounded-xl font-semibold shadow-lg shadow-green-200 dark:shadow-green-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Order...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShieldCheck size={20} />
                Place Order - ₹{formatPrice(getTotalAmount())}
              </span>
            )}
          </Button>

          {/* Order Conditions */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By placing your order, you agree to our{" "}
              <a href="/terms" className="text-green-600 hover:underline">Terms & Conditions</a>
            </p>
          </div>

          {/* SECURITY NOTE */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Secure & Encrypted</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your payment information is protected with 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - Shop Now Button */}
      {cartCount === 0 && (
        <div className="text-center py-8">
          <button
            onClick={handleEmptyCartRedirect}
            className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryForCheckout;