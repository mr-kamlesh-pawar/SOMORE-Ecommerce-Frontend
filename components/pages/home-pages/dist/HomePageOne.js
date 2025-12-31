"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.generateMetadata = exports.runtime = exports.dynamicParams = exports.revalidate = exports.fetchCache = exports.dynamic = void 0;
// app/(main)/page.tsx
var react_1 = require("react");
var HeroBannerOne_1 = require("@/components/hero/HeroBannerOne");
var Testimonials_1 = require("@/components/others/Testimonials");
var Loader_1 = require("@/components/others/Loader");
var NewLaunches_1 = require("@/components/newLaunches/NewLaunches");
var FeaturedCollection_1 = require("@/components/FeaturedCollection/FeaturedCollection");
var ShopifyCollection_1 = require("../ShopifyCollection/ShopifyCollection");
var RichTextSection_1 = require("../RichTextSection/RichTextSection");
var richTextData_1 = require("@/data/richTextData");
var appwrite_1 = require("@/lib/appwrite");
var appwrite_2 = require("appwrite");
// ⚡ ULTIMATE CACHE PREVENTION
exports.dynamic = "force-dynamic";
exports.fetchCache = "force-no-store";
exports.revalidate = 0;
exports.dynamicParams = true;
exports.runtime = 'nodejs'; // Force Node.js runtime for SSR
var BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
// ✅ Helper function to convert image IDs to URLs
function getImageUrls(imageIds) {
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        return ["/images/placeholder.png"];
    }
    return imageIds.map(function (fileId) {
        return appwrite_1.storage.getFileView(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, fileId);
    });
}
// ✅ Fetch all active products WITH CACHE BUSTING
function getActiveProducts(limit) {
    return __awaiter(this, void 0, Promise, function () {
        var timestamp, res, productsWithImageUrls, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    timestamp = Date.now();
                    console.log("\u23F0 Fetch timestamp: " + timestamp);
                    return [4 /*yield*/, appwrite_1.databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID, [
                            appwrite_2.Query.equal("isActive", true),
                            appwrite_2.Query.orderDesc("$createdAt"),
                            appwrite_2.Query.limit(limit),
                        ])];
                case 1:
                    res = _a.sent();
                    console.log("\uD83D\uDD04 Fresh fetch at " + new Date().toISOString() + ": " + res.documents.length + " active products");
                    // Debug: Show first product's update time
                    if (res.documents.length > 0) {
                        console.log("\uD83D\uDCC5 Latest product updated: " + (res.documents[0].$updatedAt || res.documents[0].$createdAt));
                    }
                    productsWithImageUrls = res.documents.map(function (product) { return (__assign(__assign({}, product), { images: getImageUrls(product.images) })); });
                    return [2 /*return*/, productsWithImageUrls];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching active products:", error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Add a no-cache header for this specific route
function generateMetadata() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    other: {
                        'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                        'pragma': 'no-cache',
                        'expires': '0'
                    }
                }];
        });
    });
}
exports.generateMetadata = generateMetadata;
function HomePageOne() {
    return __awaiter(this, void 0, void 0, function () {
        var allActiveProducts, fetchTime, newLaunches, herbalProducts, organicPowders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getActiveProducts(20)];
                case 1:
                    allActiveProducts = _a.sent();
                    fetchTime = Date.now();
                    console.log("\uD83C\uDFC1 Home page rendered at: " + fetchTime);
                    newLaunches = allActiveProducts
                        .filter(function (p) { return p.homeSection === "new-launches" || !p.homeSection; })
                        .slice(0, 4);
                    herbalProducts = allActiveProducts
                        .filter(function (p) { var _a; return p.homeSection === "herbal" || ((_a = p.category) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("herbal")); })
                        .slice(0, 8);
                    organicPowders = allActiveProducts
                        .filter(function (p) { var _a; return p.homeSection === "organic-powders" || ((_a = p.category) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("powder")); })
                        .slice(0, 4);
                    console.log("🔄 FRESH HOME DATA LOADED");
                    console.log("New Launches:", newLaunches.length);
                    console.log("Herbal Products:", herbalProducts.length);
                    console.log("Organic Powders:", organicPowders.length);
                    // Log actual products for debugging
                    console.log("📦 Actual products in newLaunches:", newLaunches.map(function (p) { return ({ name: p.name, updated: p.$updatedAt }); }));
                    return [2 /*return*/, (React.createElement(React.Fragment, null,
                            React.createElement("div", { style: { display: 'none' }, "data-timestamp": fetchTime }),
                            React.createElement("section", { className: "overflow-hidden" },
                                React.createElement(HeroBannerOne_1["default"], null),
                                React.createElement(react_1.Suspense, { fallback: React.createElement(Loader_1["default"], null) },
                                    React.createElement(NewLaunches_1["default"], { key: "new-launches-" + fetchTime, products: newLaunches.map(function (p) { return ({
                                            id: p.$id,
                                            slug: p.slug,
                                            title: p.name,
                                            price: p.price,
                                            compareAtPrice: p.marketprice,
                                            badge: p.badge,
                                            images: p.images || ["/images/placeholder.png"],
                                            isHome: true
                                        }); }), viewAllLink: "/collections/moringa-products" })),
                                React.createElement(FeaturedCollection_1["default"], { key: "herbal-" + fetchTime, title: "Best Online Store for Herbal Products and Supplements", products: herbalProducts.map(function (p) {
                                        var _a, _b;
                                        return ({
                                            id: p.$id,
                                            title: p.name,
                                            url: "/products/" + p.slug,
                                            image1: ((_a = p.images) === null || _a === void 0 ? void 0 : _a[0]) || "/images/placeholder.png",
                                            image2: (_b = p.images) === null || _b === void 0 ? void 0 : _b[1],
                                            badge: p.badge,
                                            rating: p.averagerating,
                                            ratingCount: p.reviewcount,
                                            price: "\u20B9" + p.price,
                                            compareAtPrice: p.marketprice
                                                ? "\u20B9" + p.marketprice
                                                : undefined
                                        });
                                    }), viewAllUrl: "/collections/herbal" }),
                                React.createElement(ShopifyCollection_1["default"], { key: "organic-" + fetchTime, title: "Organic Powders", products: organicPowders.map(function (p) {
                                        var _a;
                                        return ({
                                            id: p.$id,
                                            title: p.name,
                                            url: "/products/" + p.slug,
                                            image1: ((_a = p.images) === null || _a === void 0 ? void 0 : _a[0]) || "/images/placeholder.png",
                                            badge: p.badge,
                                            rating: p.averagerating,
                                            ratingCount: p.reviewcount,
                                            price: "\u20B9" + p.price,
                                            compareAtPrice: p.marketprice
                                                ? "\u20B9" + p.marketprice
                                                : undefined
                                        });
                                    }), viewAllUrl: "/collections/organic-powders" }),
                                React.createElement(Testimonials_1["default"], { textCenter: false }),
                                React.createElement(RichTextSection_1["default"], { title: richTextData_1.richTextContent.title, shortText: richTextData_1.richTextContent.shortText, longText: richTextData_1.richTextContent.longText, buttonText: richTextData_1.richTextContent.buttonText, buttonUrl: richTextData_1.richTextContent.buttonUrl }))))];
            }
        });
    });
}
exports["default"] = HomePageOne;
