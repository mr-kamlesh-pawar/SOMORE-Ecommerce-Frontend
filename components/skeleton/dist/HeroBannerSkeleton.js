"use strict";
exports.__esModule = true;
function HeroBannerSkeleton() {
    return (React.createElement("section", { className: "relative w-full bg-white" },
        React.createElement("div", { className: "w-full h-[30vh] sm:h-[35vh] md:h-[45vh] lg:h-[110vh] bg-gray-200 animate-pulse" }),
        React.createElement("div", { className: "flex justify-center gap-3 py-4" }, Array.from({ length: 3 }).map(function (_, i) { return (React.createElement("div", { key: i, className: "w-2 h-2 rounded-full bg-gray-300 animate-pulse" })); }))));
}
exports["default"] = HeroBannerSkeleton;
