"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  slung: string;
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

const initialState: CartState = {
  cartItems: [],
  couponCode: null,
};

export const CartContext = createContext<any>(null);

function cartReducer(state: CartState, action: Action): CartState {
  let updatedItems;

  switch (action.type) {
    case "ADD_TO_CART":
      const exists = state.cartItems.find((i) => i.id === action.payload.id);
      if (exists) {
        updatedItems = state.cartItems.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch({ type: "CLEAR_CART" });
      parsed.cartItems.forEach((item: CartItem) =>
        dispatch({ type: "ADD_TO_CART", payload: item })
      );
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart-data", JSON.stringify(state));
  }, [state]);

  /** CALCULATIONS */
  const getTotalPrice = () =>
    state.cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const getTax = () => getTotalPrice() * 0.1;
  const getShippingFee = () => 5;
  const getTotalAmount = () =>
    getTotalPrice() + getTax() + getShippingFee();

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        getTotalPrice,
        getTax,
        getShippingFee,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
