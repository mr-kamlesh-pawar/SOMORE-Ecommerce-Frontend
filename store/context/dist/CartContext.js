"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.CartProvider = exports.CartContext = void 0;
var react_1 = require("react");
exports.CartContext = react_1.createContext(null);
function cartReducer(state, action) {
    var updatedItems;
    var MAX_QTY_PER_PRODUCT = 7; // Define once at top
    switch (action.type) {
        case "ADD_TO_CART":
            var exists = state.cartItems.find(function (i) { return i.id === action.payload.id; });
            // ✅ VALIDATION 1: Check if adding quantity exceeds max limit
            if (action.payload.quantity > MAX_QTY_PER_PRODUCT) {
                console.error("Cannot add more than " + MAX_QTY_PER_PRODUCT + " items");
                return state;
            }
            // ✅ VALIDATION 2: Check stock for new items
            if (action.payload.quantity > action.payload.stock) {
                console.error("Only " + action.payload.stock + " items available in stock");
                return state;
            }
            if (exists) {
                // ✅ VALIDATION 3: Check if total quantity exceeds max limit
                var newTotalQuantity_1 = exists.quantity + action.payload.quantity;
                if (newTotalQuantity_1 > MAX_QTY_PER_PRODUCT) {
                    console.error("Cannot exceed " + MAX_QTY_PER_PRODUCT + " items total");
                    return state;
                }
                // ✅ VALIDATION 4: Check total against stock
                if (newTotalQuantity_1 > action.payload.stock) {
                    console.error("Only " + action.payload.stock + " items available in stock");
                    return state;
                }
                updatedItems = state.cartItems.map(function (i) {
                    return i.id === action.payload.id
                        ? __assign(__assign({}, i), { quantity: newTotalQuantity_1 }) : i;
                });
            }
            else {
                updatedItems = __spreadArrays(state.cartItems, [action.payload]);
            }
            return __assign(__assign({}, state), { cartItems: updatedItems });
        case "UPDATE_QTY":
            var itemToUpdate = state.cartItems.find(function (i) { return i.id === action.payload.id; });
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
                console.error("Cannot exceed " + MAX_QTY_PER_PRODUCT + " items");
                return state;
            }
            if (action.payload.quantity > itemToUpdate.stock) {
                console.error("Only " + itemToUpdate.stock + " items available in stock");
                return state;
            }
            return __assign(__assign({}, state), { cartItems: state.cartItems.map(function (i) {
                    return i.id === action.payload.id
                        ? __assign(__assign({}, i), { quantity: action.payload.quantity }) : i;
                }) });
        case "REMOVE_FROM_CART":
            return __assign(__assign({}, state), { cartItems: state.cartItems.filter(function (i) { return i.id !== action.payload; }) });
        case "CLEAR_CART":
            return { cartItems: [], couponCode: null };
        case "APPLY_COUPON":
            return __assign(__assign({}, state), { couponCode: action.payload });
        case "REMOVE_COUPON":
            return __assign(__assign({}, state), { couponCode: null });
        default:
            return state;
    }
}
/** Load cart from localStorage BEFORE React renders */
function loadInitialCart() {
    if (typeof window === "undefined")
        return { cartItems: [], couponCode: null };
    try {
        var saved = localStorage.getItem("cart-data");
        if (!saved)
            return { cartItems: [], couponCode: null };
        return JSON.parse(saved);
    }
    catch (_a) {
        return { cartItems: [], couponCode: null };
    }
}
function CartProvider(_a) {
    var children = _a.children;
    var _b = react_1.useReducer(cartReducer, undefined, loadInitialCart), state = _b[0], dispatch = _b[1];
    /** Save cart to localStorage whenever state updates */
    react_1.useEffect(function () {
        localStorage.setItem("cart-data", JSON.stringify(state));
    }, [state]);
    /** Calculations */
    var getTotalPrice = function () {
        return state.cartItems.reduce(function (acc, i) { return acc + i.price * i.quantity; }, 0);
    };
    var getTax = function () { return getTotalPrice() * 0.1; };
    var getShippingFee = function () { return 5; };
    var getTotalAmount = function () {
        return getTotalPrice() + getTax() + getShippingFee();
    };
    var getCartCount = function () {
        return state.cartItems.reduce(function (total, item) { return total + item.quantity; }, 0);
    };
    // Add clearCart function
    var clearCart = function () {
        dispatch({ type: "CLEAR_CART" });
    };
    return (React.createElement(exports.CartContext.Provider, { value: __assign(__assign({}, state), { dispatch: dispatch,
            getTotalPrice: getTotalPrice,
            getTax: getTax,
            getShippingFee: getShippingFee,
            getTotalAmount: getTotalAmount,
            getCartCount: getCartCount,
            clearCart: clearCart }) }, children));
}
exports.CartProvider = CartProvider;
