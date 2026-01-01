"use strict";
exports.__esModule = true;
var react_1 = require("react");
var ProductDetailsSkeleton = function () {
    return (react_1["default"].createElement("div", { className: "max-w-[1500px] mx-auto px-4 py-10 animate-pulse" },
        react_1["default"].createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12" },
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("div", { className: "w-full aspect-square rounded-xl bg-gray-300" }),
                react_1["default"].createElement("div", { className: "flex gap-3 mt-4" }, [1, 2, 3, 4].map(function (i) { return (react_1["default"].createElement("div", { key: i, className: "w-24 h-24 rounded-xl bg-gray-200" })); }))),
            react_1["default"].createElement("div", null,
                react_1["default"].createElement("div", { className: "h-8 bg-gray-300 rounded w-3/4 mb-4" }),
                react_1["default"].createElement("div", { className: "flex items-center gap-2 mb-6" },
                    react_1["default"].createElement("div", { className: "h-5 w-24 bg-gray-200 rounded" }),
                    react_1["default"].createElement("div", { className: "h-4 w-20 bg-gray-200 rounded" })),
                react_1["default"].createElement("div", { className: "h-10 bg-gray-300 rounded w-1/3 mb-2" }),
                react_1["default"].createElement("div", { className: "h-6 bg-gray-200 rounded w-1/4 mb-6" }),
                react_1["default"].createElement("div", { className: "h-5 bg-gray-200 rounded w-32 mb-6" }),
                react_1["default"].createElement("div", { className: "mb-6" },
                    react_1["default"].createElement("div", { className: "h-6 bg-gray-200 rounded w-24 mb-3" }),
                    react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                        react_1["default"].createElement("div", { className: "w-10 h-10 bg-gray-200 rounded" }),
                        react_1["default"].createElement("div", { className: "w-10 h-10 bg-gray-200 rounded" }),
                        react_1["default"].createElement("div", { className: "w-10 h-10 bg-gray-200 rounded" }))),
                react_1["default"].createElement("div", { className: "mb-8" },
                    react_1["default"].createElement("div", { className: "h-5 bg-gray-200 rounded w-40 mb-2" }),
                    react_1["default"].createElement("div", { className: "h-20 bg-gray-100 rounded w-full" })),
                react_1["default"].createElement("div", { className: "flex gap-4 mb-10" },
                    react_1["default"].createElement("div", { className: "w-1/2 h-14 bg-gray-300 rounded" }),
                    react_1["default"].createElement("div", { className: "w-1/2 h-14 bg-gray-300 rounded" })),
                react_1["default"].createElement("div", { className: "space-y-3" },
                    react_1["default"].createElement("div", { className: "h-4 bg-gray-200 rounded w-full" }),
                    react_1["default"].createElement("div", { className: "h-4 bg-gray-200 rounded w-11/12" }),
                    react_1["default"].createElement("div", { className: "h-4 bg-gray-200 rounded w-10/12" }),
                    react_1["default"].createElement("div", { className: "h-4 bg-gray-200 rounded w-full" }),
                    react_1["default"].createElement("div", { className: "h-4 bg-gray-200 rounded w-9/12" }))))));
};
exports["default"] = ProductDetailsSkeleton;
