// app/success/page.tsx
"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var link_1 = require("next/link");
var useCart_1 = require("@/store/hooks/useCart");
var OrderSuccessPage = function () {
    var searchParams = navigation_1.useSearchParams();
    var router = navigation_1.useRouter();
    var dispatch = useCart_1.useCart().dispatch;
    var orderId = searchParams.get('orderId');
    var orderNumber = searchParams.get('orderNumber');
    var _a = react_1.useState(10), countdown = _a[0], setCountdown = _a[1];
    // Clear cart on success page load (as backup)
    react_1.useEffect(function () {
        dispatch({ type: "CLEAR_CART" });
    }, [dispatch]);
    // Countdown timer for automatic redirect
    react_1.useEffect(function () {
        if (countdown > 0) {
            var timer_1 = setTimeout(function () {
                setCountdown(countdown - 1);
            }, 1000);
            return function () { return clearTimeout(timer_1); };
        }
        else {
            router.push('/');
        }
    }, [countdown, router]);
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4" },
        react_1["default"].createElement("div", { className: "max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center" },
            react_1["default"].createElement("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" },
                react_1["default"].createElement(lucide_react_1.CheckCircle, { className: "w-12 h-12 text-green-600" })),
            react_1["default"].createElement("h1", { className: "text-3xl font-bold text-gray-900 mb-2" }, "Order Confirmed! \uD83C\uDF89"),
            react_1["default"].createElement("p", { className: "text-gray-600 mb-8" }, "Thank you for your purchase. Your order has been placed successfully."),
            react_1["default"].createElement("div", { className: "bg-gray-50 rounded-xl p-6 mb-8 space-y-4" },
                react_1["default"].createElement("div", { className: "flex items-center justify-between" },
                    react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                        react_1["default"].createElement(lucide_react_1.Package, { className: "w-5 h-5 text-gray-500" }),
                        react_1["default"].createElement("span", { className: "text-gray-700" }, "Order Number:")),
                    react_1["default"].createElement("span", { className: "font-semibold text-gray-900" },
                        "#",
                        orderNumber || 'N/A')),
                react_1["default"].createElement("div", { className: "flex items-center justify-between" },
                    react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                        react_1["default"].createElement(lucide_react_1.Clock, { className: "w-5 h-5 text-gray-500" }),
                        react_1["default"].createElement("span", { className: "text-gray-700" }, "Order ID:")),
                    react_1["default"].createElement("span", { className: "font-semibold text-gray-900" }, orderId === null || orderId === void 0 ? void 0 :
                        orderId.slice(0, 8),
                        "..."))),
            react_1["default"].createElement("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8" },
                react_1["default"].createElement("p", { className: "text-blue-800 text-sm" },
                    react_1["default"].createElement("strong", null, "What's next?"),
                    " We've sent you an email confirmation. Your order will be processed and shipped within 24-48 hours.")),
            react_1["default"].createElement("div", { className: "space-y-4" },
                react_1["default"].createElement(button_1.Button, { asChild: true, className: "w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-xl" },
                    react_1["default"].createElement(link_1["default"], { href: "/orders" },
                        react_1["default"].createElement(lucide_react_1.Package, { className: "w-5 h-5 mr-2" }),
                        "View My Orders")),
                react_1["default"].createElement(button_1.Button, { variant: "outline", asChild: true, className: "w-full py-6 text-lg rounded-xl" },
                    react_1["default"].createElement(link_1["default"], { href: "/" },
                        react_1["default"].createElement(lucide_react_1.Home, { className: "w-5 h-5 mr-2" }),
                        "Continue Shopping"))),
            react_1["default"].createElement("p", { className: "text-gray-500 text-sm mt-8" },
                "Redirecting to home in ",
                countdown,
                " seconds..."))));
};
exports["default"] = OrderSuccessPage;
