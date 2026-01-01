"use client";
"use strict";
exports.__esModule = true;
var separator_1 = require("@/components/ui/separator");
var react_1 = require("react");
var CheckoutAddress_1 = require("@/components/pages/checkout-pages/CheckoutAddress");
var navigation_1 = require("next/navigation");
var AuthContext_1 = require("@/store/context/AuthContext");
var CheckoutLoader_1 = require("@/components/skeleton/CheckoutLoader");
var CheckoutAddressPage = function () {
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
                    react_1["default"].createElement("li", { className: "text-gray-900 font-medium" }, "Address"))),
            react_1["default"].createElement("div", { className: "mb-6" },
                react_1["default"].createElement("h1", { className: "text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2" }, "Select Delivery Address"),
                react_1["default"].createElement("div", { className: "flex items-center gap-2 text-sm text-gray-600" },
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Cart"),
                    react_1["default"].createElement("span", { className: "text-gray-400" }, "\u2192"),
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full " + (addressSelected ? 'bg-green-500' : 'bg-gray-300') }),
                        "Address"),
                    react_1["default"].createElement("span", { className: "text-gray-400" }, "\u2192"),
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Checkout"),
                    react_1["default"].createElement("span", { className: "text-gray-400" }, "\u2192"),
                    react_1["default"].createElement("span", { className: "flex items-center gap-1" },
                        react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-gray-300" }),
                        "Success")),
                react_1["default"].createElement(separator_1.Separator, { className: "dark:bg-white/50 mt-4" })),
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("div", { className: "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm" },
                    react_1["default"].createElement("div", { className: "flex items-center justify-between mb-6" },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-1" }, "Shipping Address"),
                            react_1["default"].createElement("p", { className: "text-sm text-gray-500" }, addressSelected
                                ? "Address selected ✓"
                                : "Please select or add a shipping address")),
                        react_1["default"].createElement("div", { className: "px-3 py-1 rounded-full text-sm font-medium " + (addressSelected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800') }, addressSelected ? 'Ready' : 'Required')),
                    react_1["default"].createElement(CheckoutAddress_1["default"], { onAddressSelect: function () { return setAddressSelected(true); } })),
                react_1["default"].createElement("div", { className: "mt-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6" },
                    react_1["default"].createElement("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4" }, "Shipping Information"),
                    react_1["default"].createElement("ul", { className: "space-y-3 text-sm text-gray-600" },
                        react_1["default"].createElement("li", { className: "flex items-start gap-2" },
                            react_1["default"].createElement("div", { className: "text-green-600 mt-0.5" }, "\u2713"),
                            react_1["default"].createElement("span", null, "Free shipping on orders over \u20B9499")),
                        react_1["default"].createElement("li", { className: "flex items-start gap-2" },
                            react_1["default"].createElement("div", { className: "text-green-600 mt-0.5" }, "\u2713"),
                            react_1["default"].createElement("span", null, "2-4 business days delivery")),
                        react_1["default"].createElement("li", { className: "flex items-start gap-2" },
                            react_1["default"].createElement("div", { className: "text-green-600 mt-0.5" }, "\u2713"),
                            react_1["default"].createElement("span", null, "Cash on delivery available")),
                        react_1["default"].createElement("li", { className: "flex items-start gap-2" },
                            react_1["default"].createElement("div", { className: "text-green-600 mt-0.5" }, "\u2713"),
                            react_1["default"].createElement("span", null, "Track your order via SMS & Email"))))))));
};
exports["default"] = CheckoutAddressPage;
