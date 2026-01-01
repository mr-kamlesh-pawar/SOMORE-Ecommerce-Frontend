"use strict";
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var CheckoutBtn = function (_a) {
    var _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    // 🔒 Disabled state (NO navigation)
    if (disabled) {
        return (react_1["default"].createElement("button", { disabled: true, className: "\r\n          w-full flex items-center justify-center gap-3 my-2 text-xl\r\n          bg-gray-400 text-white py-3 px-8 rounded-full\r\n          cursor-not-allowed opacity-70\r\n        " },
            react_1["default"].createElement(lucide_react_1.ArrowRight, null),
            " Checkout Now"));
    }
    // ✅ Enabled state (Navigation allowed)
    return (react_1["default"].createElement(link_1["default"], { href: "/checkout/address", className: "\r\n        w-full flex items-center justify-center gap-3 my-2 text-xl\r\n        bg-[#063E09] text-white py-3 px-8 rounded-full\r\n        hover:bg-[#07700c] focus:outline-none\r\n      " },
        react_1["default"].createElement(lucide_react_1.ArrowRight, null),
        " Checkout Now"));
};
exports["default"] = CheckoutBtn;
