"use strict";
exports.__esModule = true;
function NewLaunchesSkeleton() {
    return (React.createElement("section", { className: "w-full bg-white py-6 md:py-10" },
        React.createElement("div", { className: "max-w-[1600px] mx-auto px-3 md:px-6" },
            React.createElement("div", { className: "h-8 w-56 bg-gray-200 rounded mx-auto mb-8 animate-pulse" }),
            React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4" }, Array.from({ length: 4 }).map(function (_, i) { return (React.createElement("div", { key: i, className: "text-center" },
                React.createElement("div", { className: "aspect-square w-full bg-gray-200 rounded-lg animate-pulse" }),
                React.createElement("div", { className: "h-4 bg-gray-200 rounded mt-4 mx-4 animate-pulse" }),
                React.createElement("div", { className: "h-4 bg-gray-200 rounded mt-2 mx-8 animate-pulse" }),
                React.createElement("div", { className: "h-4 w-20 bg-gray-200 rounded mt-3 mx-auto animate-pulse" }))); })),
            React.createElement("div", { className: "flex justify-center mt-10" },
                React.createElement("div", { className: "h-10 w-32 bg-gray-200 rounded animate-pulse" })))));
}
exports["default"] = NewLaunchesSkeleton;
