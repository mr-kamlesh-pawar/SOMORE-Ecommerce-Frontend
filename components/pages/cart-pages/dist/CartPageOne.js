"use client";
"use strict";
exports.__esModule = true;
var CartItemsDetails_1 = require("@/components/carts/CartItemsDetails");
var OrderSummaryForCart_1 = require("@/components/carts/OrderSummaryForCart");
var separator_1 = require("@/components/ui/separator");
var CartPageOne = function () {
    return (React.createElement("section", { className: "px-4 py-4 lg:px-16 dark:bg-gray-800 min-h-screen bg-gray-50" },
        React.createElement("div", { className: "max-w-screen-xl mx-auto" },
            React.createElement("nav", { className: "mb-6" },
                React.createElement("ol", { className: "flex items-center space-x-2 text-sm" },
                    React.createElement("li", null,
                        React.createElement("a", { href: "/", className: "text-gray-500 hover:text-gray-700" }, "Home")),
                    React.createElement("li", { className: "text-gray-400" }, "\u203A"),
                    React.createElement("li", { className: "text-gray-900 font-medium" }, "Cart"))),
            React.createElement("div", { className: "mb-6" },
                React.createElement("h1", { className: "text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2" }, "Shopping Cart"),
                React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600" },
                    React.createElement("span", { className: "flex items-center gap-1" },
                        React.createElement("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
                        "Cart"),
                    React.createElement("span", { className: "text-gray-400" }, "\u2192"),
                    React.createElement("span", { className: "flex items-center gap-1" },
                        React.createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Address"),
                    React.createElement("span", { className: "text-gray-400" }, "\u2192"),
                    React.createElement("span", { className: "flex items-center gap-1" },
                        React.createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Checkout"),
                    React.createElement("span", { className: "text-gray-400" }, "\u2192"),
                    React.createElement("span", { className: "flex items-center gap-1" },
                        React.createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Success")),
                React.createElement(separator_1.Separator, { className: "dark:bg-white/50 mt-4" })),
            React.createElement("div", { className: "max-w-7xl mx-auto" },
                React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
                    React.createElement("div", { className: "lg:col-span-2" },
                        React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6" },
                            React.createElement(CartItemsDetails_1["default"], null))),
                    React.createElement("div", { className: "lg:col-span-1" },
                        React.createElement("div", { className: "sticky top-24" },
                            React.createElement("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6" },
                                React.createElement(OrderSummaryForCart_1["default"], null)))))))));
};
exports["default"] = CartPageOne;
