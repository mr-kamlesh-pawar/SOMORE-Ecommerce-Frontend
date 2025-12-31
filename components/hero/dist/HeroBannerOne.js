"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var carousel_1 = require("@/components/ui/carousel");
var embla_carousel_autoplay_1 = require("embla-carousel-autoplay");
var image_1 = require("next/image");
var link_1 = require("next/link");
var bannerData_1 = require("@/data/banner/bannerData");
function HeroBannerOne() {
    var _a = react_1.useState(), api = _a[0], setApi = _a[1];
    var _b = react_1.useState(0), current = _b[0], setCurrent = _b[1];
    // Sync dots with slider
    react_1.useEffect(function () {
        if (!api)
            return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", function () { return setCurrent(api.selectedScrollSnap()); });
    }, [api]);
    return (react_1["default"].createElement("section", { className: "relative w-full bg-white" },
        react_1["default"].createElement("div", { className: "relative w-full overflow-hidden" },
            react_1["default"].createElement(carousel_1.Carousel, { setApi: setApi, opts: { loop: true }, plugins: [
                    embla_carousel_autoplay_1["default"]({
                        delay: 4000,
                        stopOnInteraction: false
                    }),
                ], className: "w-full" },
                react_1["default"].createElement(carousel_1.CarouselContent, null, bannerData_1.bannerData.map(function (slide, index) {
                    var _a;
                    return (react_1["default"].createElement(carousel_1.CarouselItem, { key: index },
                        react_1["default"].createElement(link_1["default"], { href: (_a = slide.link) !== null && _a !== void 0 ? _a : "#", className: "block w-full" },
                            react_1["default"].createElement("div", { className: "relative w-full \r\n  h-[30vh] sm:h-[35vh] md:h-[45vh] \r\n  lg:h-[110vh]" },
                                react_1["default"].createElement(image_1["default"], { src: slide.images[0], fill: true, priority: index === 0, alt: slide.title, className: "w-full h-full\r\n  object-contain\r\n  lg:object-cover\r\n" })))));
                })))),
        react_1["default"].createElement("div", { className: "w-full flex justify-center py-2 lg:py-4 " },
            react_1["default"].createElement("svg", { className: "w-4 h-4 rotate-90 mx-2", viewBox: "0 0 10 6" },
                react_1["default"].createElement("path", { fill: "currentColor", d: "M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708" })),
            react_1["default"].createElement("div", { className: "flex gap-3 slideshow__control-wrapper" }, bannerData_1.bannerData.map(function (_, i) {
                var active = i === current;
                return (react_1["default"].createElement("button", { key: i, onClick: function () { return api === null || api === void 0 ? void 0 : api.scrollTo(i); }, "aria-label": "Go to slide " + (i + 1), "aria-current": active ? "true" : undefined, className: "\n                  slider-counter__link slider-counter__link--dots\n                  " + (active ? "slider-counter__link--active" : "") + "\n                  " },
                    react_1["default"].createElement("span", { className: "dot" })));
            })),
            react_1["default"].createElement("svg", { className: "w-4 h-4 -rotate-90 mx-2", viewBox: "0 0 10 6" },
                react_1["default"].createElement("path", { fill: "currentColor", d: "M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708" })),
            react_1["default"].createElement("style", { jsx: true }, "\n          .slider-counter__link {\n            display: inline-flex;\n            align-items: center;\n            justify-content: center;\n            padding: 0;\n            border: none;\n            background: transparent;\n            cursor: pointer;\n          }\n\n          .dot {\n            width: 9px;\n            height: 9px;\n            border-radius: 9999px;\n            background: rgba(18, 18, 18, 0.25);\n            transition: transform 0.25s ease, background 0.25s ease;\n          }\n\n          .slider-counter__link--active .dot {\n            background: rgba(18, 18, 18, 0.95);\n            transform: scale(1.25);\n          }\n\n          :global(.dark) .dot {\n            background: rgba(255, 255, 255, 0.3);\n          }\n\n          :global(.dark) .slider-counter__link--active .dot {\n            background: rgba(255, 255, 255, 1);\n          }\n        "))));
}
exports["default"] = HeroBannerOne;
