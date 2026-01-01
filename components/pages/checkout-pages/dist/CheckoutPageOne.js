"use client";
"use strict";
exports.__esModule = true;
var OrderSummaryForCheckout_1 = require("@/components/carts/OrderSummaryForCheckout");
var separator_1 = require("@/components/ui/separator");
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var AuthContext_1 = require("@/store/context/AuthContext");
var CheckoutLoader_1 = require("@/components/skeleton/CheckoutLoader");
var CheckoutPageOne = function () {
    var _a = AuthContext_1.useAuth(), user = _a.user, loading = _a.loading;
    var router = navigation_1.useRouter();
    var _b = react_1.useState(false), addressSelected = _b[0], setAddressSelected = _b[1];
    // 🔐 Protect checkout
    react_1.useEffect(function () {
        if (!loading && !user) {
            router.replace("/login?redirect=/checkout");
        }
    }, [user, loading, router]);
    // Check if address is selected from localStorage
    react_1.useEffect(function () {
        var savedAddress = localStorage.getItem('selectedAddress');
        if (savedAddress) {
            try {
                JSON.parse(savedAddress);
                setAddressSelected(true);
            }
            catch (e) {
                // Invalid JSON
            }
        }
    }, []);
    if (loading || !user) {
        return react_1["default"].createElement(CheckoutLoader_1["default"], null);
    }
    return (react_1["default"].createElement("section", { className: "px-4 py-4 lg:px-16 bg-white dark:bg-gray-800 min-h-screen" },
        react_1["default"].createElement("div", { className: "max-w-screen-xl mx-auto" },
            react_1["default"].createElement("nav", { className: "mb-6" },
                react_1["default"].createElement("ol", { className: "flex items-center space-x-2 text-sm" },
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("a", { href: "/", className: "text-gray-500 hover:text-gray-700" }, "Home")),
                    react_1["default"].createElement("li", { className: "text-gray-400" }, "\u203A"),
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("a", { href: "/cart", className: "text-gray-500 hover:text-gray-700" }, "Cart")),
                    react_1["default"].createElement("li", { className: "text-gray-400" }, "\u203A"),
                    react_1["default"].createElement("li", null,
                        react_1["default"].createElement("a", { href: "/checkout/address", className: "text-gray-500 hover:text-gray-700" }, "Address")),
                    react_1["default"].createElement("li", { className: "text-gray-400" }, "\u203A"),
                    react_1["default"].createElement("li", { className: "text-gray-900 font-medium" }, "Checkout"))),
            react_1["default"].createElement("div", { className: "mb-6" },
                react_1["default"].createElement("h1", { className: "text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2" }, "Checkout"),
                react_1["default"].createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600" },
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Cart"),
                    react_1["default"].createElement("span", { className: "text-gray-400" }, "\u2192"),
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Address"),
                    react_1["default"].createElement("span", { className: "text-gray-400" }, "\u2192"),
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full " + (addressSelected ? 'bg-green-500' : 'bg-gray-300') }),
                        "Checkout"),
                    react_1["default"].createElement("span", { className: "text-gray-400" }, "\u2192"),
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Success")),
                react_1["default"].createElement(separator_1.Separator, { className: "dark:bg-white/50 mt-4" })),
            react_1["default"].createElement("div", { className: "lg:sticky lg:top-24" },
                react_1["default"].createElement(OrderSummaryForCheckout_1["default"], null)),
            react_1["default"].createElement("div", { className: "mt-12 pt-8 border-t border-gray-200 dark:border-gray-700" },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 text-center" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("div", { className: "text-2xl mb-2" }, "\uD83D\uDD12"),
                        react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white" }, "Secure Payment"),
                        react_1["default"].createElement("p", { className: "text-sm text-gray-600 mt-1" }, "Your payment information is encrypted")),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("div", { className: "text-2xl mb-2" }, "\uD83D\uDD04"),
                        react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white" }, "Easy Returns"),
                        react_1["default"].createElement("p", { className: "text-sm text-gray-600 mt-1" }, "30-day return policy")),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("div", { className: "text-2xl mb-2" }, "\uD83D\uDCDE"),
                        react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white" }, "24/7 Support"),
                        react_1["default"].createElement("p", { className: "text-sm text-gray-600 mt-1" }, "Call 1800-123-4567")))))));
};
exports["default"] = CheckoutPageOne;
