'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var CheckoutBtn_1 = require("../buttons/CheckoutBtn");
var Loader_1 = require("../others/Loader");
var formatPrice_1 = require("@/lib/formatPrice");
var useCart_1 = require("@/store/hooks/useCart");
var OrderSummaryForCart = function () {
    var _a = react_1.useState(false), isMounted = _a[0], setIsMounted = _a[1];
    var _b = useCart_1.useCart(), getTotalPrice = _b.getTotalPrice, getTax = _b.getTax, getShippingFee = _b.getShippingFee, getTotalAmount = _b.getTotalAmount, cartItems = _b.cartItems;
    react_1.useEffect(function () {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return react_1["default"].createElement(Loader_1["default"], null);
    }
    var isCartEmpty = !cartItems || cartItems.length === 0;
    return (react_1["default"].createElement("div", { className: "w-full shadow-md  bg-gray-100 dark:bg-gray-700 p-4 md:p-6 rounded-lg" },
        react_1["default"].createElement("h2", { className: "text-2xl font-semibold text-gray-900 dark:text-white mb-4" }, "Order Summary"),
        react_1["default"].createElement("div", { className: "flex justify-between mb-4" },
            react_1["default"].createElement("span", { className: "text-gray-700 dark:text-gray-300" }, "Subtotal:"),
            react_1["default"].createElement("span", { className: "text-gray-900 dark:text-white" },
                "\u20B9",
                formatPrice_1.formatPrice(getTotalPrice()))),
        react_1["default"].createElement("div", { className: "flex justify-between mb-4" },
            react_1["default"].createElement("span", { className: "text-gray-700 dark:text-gray-300" }, "Shipping:"),
            react_1["default"].createElement("span", { className: "text-gray-900 dark:text-white" },
                "\u20B9",
                formatPrice_1.formatPrice(isCartEmpty ? 0 : getShippingFee()))),
        react_1["default"].createElement("div", { className: "flex justify-between mb-4" },
            react_1["default"].createElement("span", { className: "text-gray-700 dark:text-gray-300" }, "Tax:"),
            react_1["default"].createElement("span", { className: "text-gray-900 dark:text-white" },
                "\u20B9",
                formatPrice_1.formatPrice(getTax()))),
        react_1["default"].createElement("div", { className: "flex justify-between" },
            react_1["default"].createElement("span", { className: "text-xl font-semibold text-gray-900 dark:text-white" }, "Total:"),
            react_1["default"].createElement("span", { className: "text-xl font-semibold text-gray-900 dark:text-white" },
                "\u20B9",
                formatPrice_1.formatPrice(isCartEmpty ? 0 : getTotalAmount()))),
        react_1["default"].createElement("div", { className: "w-fit mt-4" },
            react_1["default"].createElement(CheckoutBtn_1["default"], { disabled: isCartEmpty }))));
};
exports["default"] = OrderSummaryForCart;
