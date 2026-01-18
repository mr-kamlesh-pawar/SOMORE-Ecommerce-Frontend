"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var carousel_1 = require("@/components/ui/carousel");
var embla_carousel_autoplay_1 = require("embla-carousel-autoplay");
var image_1 = require("next/image");
var link_1 = require("next/link");
var appwrite_1 = require("@/lib/appwrite");
var appwrite_2 = require("appwrite");
var appwriteImage_1 = require("@/lib/appwriteImage");
var HeroBannerSkeleton_1 = require("@/components/skeleton/HeroBannerSkeleton");
function HeroBannerOne() {
    var _a = react_1.useState(), api = _a[0], setApi = _a[1];
    var _b = react_1.useState(0), current = _b[0], setCurrent = _b[1];
    var _c = react_1.useState([]), banners = _c[0], setBanners = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    // Fetch banners from Appwrite
    function fetchBanners() {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, appwrite_1.databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_BANNERS_COLLECTION_ID, [appwrite_2.Query.orderAsc("$createdAt")])];
                    case 1:
                        res = _a.sent();
                        setBanners(res.documents);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Banner fetch error:", err_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        fetchBanners();
    }, []);
    // Sync dots
    react_1.useEffect(function () {
        if (!api)
            return;
        setCurrent(api.selectedScrollSnap());
        api.on("select", function () { return setCurrent(api.selectedScrollSnap()); });
    }, [api]);
    if (loading)
        return react_1["default"].createElement(HeroBannerSkeleton_1["default"], null);
    if (!banners.length)
        return null;
    return (react_1["default"].createElement("section", { className: "relative w-full bg-white" },
        react_1["default"].createElement("div", { className: "relative w-full overflow-hidden" },
            react_1["default"].createElement(carousel_1.Carousel, { setApi: setApi, opts: { loop: true }, plugins: [
                    embla_carousel_autoplay_1["default"]({
                        delay: 4000,
                        stopOnInteraction: false
                    }),
                ] },
                react_1["default"].createElement(carousel_1.CarouselContent, null, banners.map(function (banner, index) { return (react_1["default"].createElement(carousel_1.CarouselItem, { key: banner.$id },
                    react_1["default"].createElement(link_1["default"], { href: "/products", className: "block w-full" },
                        react_1["default"].createElement("div", { className: "\r\n                      relative w-full \r\n                      h-[30vh] sm:h-[35vh] md:h-[45vh] \r\n                      lg:h-[110vh]\r\n                    " },
                            react_1["default"].createElement(image_1["default"], { src: appwriteImage_1.getAppwriteImageUrl(banner.bannerimg, banner.$updatedAt), alt: banner.name, fill: true, priority: index === 0, className: "object-contain lg:object-cover", unoptimized: true }))))); })))),
        react_1["default"].createElement("div", { className: "w-full flex justify-center py-3 gap-3" }, banners.map(function (_, i) { return (react_1["default"].createElement("button", { key: i, onClick: function () { return api === null || api === void 0 ? void 0 : api.scrollTo(i); }, className: "w-2 h-2 rounded-full transition " + (i === current ? "bg-black scale-125" : "bg-gray-400"), "aria-label": "Go to slide " + (i + 1) })); }))));
}
exports["default"] = HeroBannerOne;
