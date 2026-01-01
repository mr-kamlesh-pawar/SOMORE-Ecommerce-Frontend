"use strict";
exports.__esModule = true;
// components/orders/OrderStatusBadge.tsx
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var OrderStatusBadge = function (_a) {
    var status = _a.status;
    var statusConfig = {
        pending: {
            label: 'Pending',
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            icon: react_1["default"].createElement(lucide_react_1.Clock, { size: 14 })
        },
        confirmed: {
            label: 'Confirmed',
            color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            icon: react_1["default"].createElement(lucide_react_1.CheckCircle, { size: 14 })
        },
        processing: {
            label: 'Processing',
            color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
            icon: react_1["default"].createElement(lucide_react_1.RefreshCw, { size: 14 })
        },
        shipped: {
            label: 'Shipped',
            color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            icon: react_1["default"].createElement(lucide_react_1.Truck, { size: 14 })
        },
        delivered: {
            label: 'Delivered',
            color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            icon: react_1["default"].createElement(lucide_react_1.CheckCircle, { size: 14 })
        },
        cancelled: {
            label: 'Cancelled',
            color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            icon: react_1["default"].createElement(lucide_react_1.AlertCircle, { size: 14 })
        }
    };
    var config = statusConfig[status] || statusConfig.pending;
    return (react_1["default"].createElement("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium " + config.color },
        config.icon,
        config.label));
};
exports["default"] = OrderStatusBadge;
