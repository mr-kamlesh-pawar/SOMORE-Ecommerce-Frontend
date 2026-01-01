// components/checkout/ProgressStepper.tsx
"use client";
"use strict";
exports.__esModule = true;
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var steps = [
    {
        id: "cart",
        name: "Cart",
        path: "/cart",
        icon: lucide_react_1.ShoppingCart
    },
    {
        id: "address",
        name: "Shipping",
        path: "/checkout/address",
        icon: lucide_react_1.MapPin
    },
    {
        id: "checkout",
        name: "Payment",
        path: "/checkout",
        icon: lucide_react_1.CreditCard
    },
    {
        id: "complete",
        name: "Complete",
        path: "/success",
        icon: lucide_react_1.CheckCircle
    },
];
var ProgressStepper = function (_a) {
    var _b;
    var currentStep = _a.currentStep;
    var pathname = navigation_1.usePathname();
    var currentIndex = steps.findIndex(function (step) { return step.id === currentStep; });
    return (React.createElement("div", { className: "w-full max-w-4xl mx-auto px-4 py-2" },
        React.createElement("div", { className: "hidden md:block" },
            React.createElement("div", { className: "relative" },
                React.createElement("div", { className: "absolute top-4 left-0 right-0 h-0.5 bg-gray-200" },
                    React.createElement("div", { className: "absolute top-0 left-0 h-full bg-green-600 transition-all duration-500", style: {
                            width: (currentIndex / (steps.length - 1)) * 100 + "%"
                        } })),
                React.createElement("div", { className: "flex justify-between" }, steps.map(function (step, index) {
                    var isCompleted = index < currentIndex;
                    var isCurrent = index === currentIndex;
                    return (React.createElement("div", { key: step.id, className: "flex flex-col items-center relative z-10" },
                        React.createElement("div", { className: "\n                    w-10 h-10 rounded-full flex items-center justify-center\n                    transition-all duration-300\n                    " + (isCompleted
                                ? "bg-green-600 text-white"
                                : isCurrent
                                    ? "bg-white text-green-600 border-2 border-green-600"
                                    : "bg-gray-100 text-gray-400") + "\n                  " },
                            React.createElement(step.icon, { size: 18 })),
                        React.createElement("span", { className: "\n                    mt-3 text-sm font-medium\n                    " + (isCompleted || isCurrent
                                ? "text-green-600"
                                : "text-gray-400") + "\n                  " }, step.name),
                        React.createElement("span", { className: "text-xs text-gray-500 mt-1" },
                            "Step ",
                            index + 1)));
                })))),
        React.createElement("div", { className: "md:hidden" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", { className: "flex-1" },
                    React.createElement("div", { className: "flex items-center gap-2" },
                        React.createElement("div", { className: "\n                w-8 h-8 rounded-full flex items-center justify-center\n                " + (currentIndex >= 0 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400") + "\n              " },
                            React.createElement(lucide_react_1.ShoppingCart, { size: 14 })),
                        React.createElement("div", { className: "text-xs" },
                            React.createElement("p", { className: currentIndex >= 0 ? "text-green-600 font-medium" : "text-gray-400" },
                                "Step ",
                                currentIndex + 1,
                                " of ",
                                steps.length),
                            React.createElement("p", { className: "text-xs text-gray-500" }, ((_b = steps[currentIndex]) === null || _b === void 0 ? void 0 : _b.name) || "Cart")))),
                React.createElement("div", { className: "text-right" },
                    React.createElement("p", { className: "text-xs text-gray-500" }, "Progress"),
                    React.createElement("p", { className: "text-sm font-medium" },
                        Math.round((currentIndex / steps.length) * 100),
                        "%"))),
            React.createElement("div", { className: "mt-4 h-1 bg-gray-200 rounded-full overflow-hidden" },
                React.createElement("div", { className: "h-full bg-green-600 transition-all duration-500", style: {
                        width: (currentIndex / (steps.length - 1)) * 100 + "%"
                    } })))));
};
exports["default"] = ProgressStepper;
