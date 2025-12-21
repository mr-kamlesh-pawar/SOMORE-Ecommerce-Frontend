"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  slug: string;
}


interface CartState {
  cartItems: CartItem[];
  couponCode: string | null;
}

type Action =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QTY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "REMOVE_COUPON" };

export const CartContext = createContext<any>(null);

function cartReducer(state: CartState, action: Action): CartState {
  let updatedItems;

  switch (action.type) {
    case "ADD_TO_CART":
      const exists = state.cartItems.find((i) => i.id === action.payload.id);

      if (exists) {
        updatedItems = state.cartItems.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i
        );
      } else {
        updatedItems = [...state.cartItems, action.payload];
      }
      return { ...state, cartItems: updatedItems };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.id !== action.payload),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "CLEAR_CART":
      return { cartItems: [], couponCode: null };

    case "APPLY_COUPON":
      return { ...state, couponCode: action.payload };

    case "REMOVE_COUPON":
      return { ...state, couponCode: null };

    default:
      return state;
  }
}

/** Load cart from localStorage BEFORE React renders */
function loadInitialCart(): CartState {
  if (typeof window === "undefined") return { cartItems: [], couponCode: null };

  try {
    const saved = localStorage.getItem("cart-data");
    if (!saved) return { cartItems: [], couponCode: null };
    return JSON.parse(saved);
  } catch {
    return { cartItems: [], couponCode: null };
  }
}



export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  /** Save cart to localStorage whenever state updates */
  useEffect(() => {
    localStorage.setItem("cart-data", JSON.stringify(state));
  }, [state]);

  /** Calculations */
  const getTotalPrice = () =>
    state.cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const getTax = () => getTotalPrice() * 0.1;
  const getShippingFee = () => 5;
  const getTotalAmount = () =>
    getTotalPrice() + getTax() + getShippingFee();

  const getCartCount = () =>
    state.cartItems.reduce((total, item) => total + item.quantity, 0);


  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        getTotalPrice,
        getTax,
        getShippingFee,
        getTotalAmount,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
