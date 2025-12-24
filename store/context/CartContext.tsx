"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  slug: string;
  stock: number;
}


interface CartState {
  cartItems: CartItem[];
  couponCode: string | null;
}

type Action =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "REMOVE_COUPON" };

  export const CartContext = createContext<any>(null);
  
 function cartReducer(state: CartState, action: Action): CartState {
  let updatedItems;
  const MAX_QTY_PER_PRODUCT = 7; // Define once at top

  switch (action.type) {
    case "ADD_TO_CART":
      const exists = state.cartItems.find((i) => i.id === action.payload.id);

      // ✅ VALIDATION 1: Check if adding quantity exceeds max limit
      if (action.payload.quantity > MAX_QTY_PER_PRODUCT) {
        console.error(`Cannot add more than ${MAX_QTY_PER_PRODUCT} items`);
        return state;
      }

      // ✅ VALIDATION 2: Check stock for new items
      if (action.payload.quantity > action.payload.stock) {
        console.error(`Only ${action.payload.stock} items available in stock`);
        return state;
      }

      if (exists) {
        // ✅ VALIDATION 3: Check if total quantity exceeds max limit
        const newTotalQuantity = exists.quantity + action.payload.quantity;
        if (newTotalQuantity > MAX_QTY_PER_PRODUCT) {
          console.error(`Cannot exceed ${MAX_QTY_PER_PRODUCT} items total`);
          return state;
        }

        // ✅ VALIDATION 4: Check total against stock
        if (newTotalQuantity > action.payload.stock) {
          console.error(`Only ${action.payload.stock} items available in stock`);
          return state;
        }

        updatedItems = state.cartItems.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: newTotalQuantity }
            : i
        );
      } else {
        updatedItems = [...state.cartItems, action.payload];
      }
      return { ...state, cartItems: updatedItems };

    case "UPDATE_QTY":
      const itemToUpdate = state.cartItems.find((i) => i.id === action.payload.id);
      
      if (!itemToUpdate) {
        // Item doesn't exist in cart
        console.error("Item not found in cart");
        return state;
      }

      // Validate new quantity
      if (action.payload.quantity < 1) {
        console.error("Quantity must be at least 1");
        return state;
      }

      if (action.payload.quantity > MAX_QTY_PER_PRODUCT) {
        console.error(`Cannot exceed ${MAX_QTY_PER_PRODUCT} items`);
        return state;
      }

      if (action.payload.quantity > itemToUpdate.stock) {
        console.error(`Only ${itemToUpdate.stock} items available in stock`);
        return state;
      }

      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.id !== action.payload),
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
