"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var image_1 = require("next/image");
var link_1 = require("next/link");
function NewLaunches(_a) {
    var _b = _a.title, title = _b === void 0 ? "NEW LAUNCHES" : _b, products = _a.products, _c = _a.viewAllLink, viewAllLink = _c === void 0 ? "#" : _c;
    var _d = react_1.useState(new Set()), imageErrors = _d[0], setImageErrors = _d[1];
    // Convert incoming data → component-friendly format
    var mappedProducts = products.map(function (item) {
        var _a;
        return ({
            id: item.id,
            title: item.title,
            price: "\u20B9" + item.price,
            compareAtPrice: item.compareAtPrice ? "\u20B9" + item.compareAtPrice : undefined,
            badge: item.badge,
            image: ((_a = item.images) === null || _a === void 0 ? void 0 : _a[0]) || "/images/placeholder.png",
            link: "/products/" + item.slug,
            isHome: item.isHome
        });
    });
    var homeProducts = mappedProducts.filter(function (p) { return p.isHome; });
    var handleImageError = function (id) {
        setImageErrors(function (prev) {
            var newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };
    return (React.createElement("section", { className: "w-full bg-white py-6 md:py-10" },
        React.createElement("div", { className: "max-w-[1600px] mx-auto px-3 md:px-6" },
            React.createElement("h2", { className: "text-center text-2xl md:text-4xl font-bold text-black tracking-wide mb-6 md:mb-10" }, title),
            React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4" }, homeProducts.map(function (item, index) { return (React.createElement(link_1["default"], { key: item.id, href: item.link, className: "group text-center", "aria-label": "View " + item.title },
                React.createElement("div", { className: "relative w-full mx-auto aspect-square overflow-hidden rounded-lg" },
                    imageErrors.has(item.id) ? (React.createElement("div", { className: "w-full h-full flex items-center justify-center bg-gray-100" },
                        React.createElement("span", { className: "text-gray-400 text-sm" }, "Image not available"))) : (React.createElement(image_1["default"], { src: item.image, alt: item.title, fill: true, className: "object-contain transition-all duration-500 group-hover:scale-105", sizes: "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw", onError: function () { return handleImageError(item.id); }, priority: index < 2, unoptimized: item.image.includes('appwrite.io') })),
                    index === 3 && item.badge && (React.createElement("span", { className: "absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full z-10" }, item.badge))),
                React.createElement("h3", { className: "mt-4 text-sm md:text-base font-medium text-black leading-tight px-2 line-clamp-2" }, item.title),
                React.createElement("div", { className: "mt-2" }, item.compareAtPrice ? (React.createElement("div", { className: "flex justify-center items-center gap-2" },
                    React.createElement("span", { className: "text-sm line-through text-gray-400" }, item.compareAtPrice),
                    React.createElement("span", { className: "text-sm font-semibold text-red-600" }, item.price))) : (React.createElement("span", { className: "text-sm font-semibold text-black" }, item.price))))); })),
            React.createElement("div", { className: "flex justify-center mt-10" },
                React.createElement(link_1["default"], { href: viewAllLink, className: "bg-black text-white px-10 py-3 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors duration-300", "aria-label": "View all new launch products" }, "View all")))));
}
exports["default"] = NewLaunches;
