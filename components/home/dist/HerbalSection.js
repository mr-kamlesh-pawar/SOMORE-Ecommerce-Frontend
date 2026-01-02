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
var appwrite_1 = require("@/lib/appwrite");
var appwrite_2 = require("appwrite");
var FeaturedCollection_1 = require("@/components/FeaturedCollection/FeaturedCollection");
var appwriteImage_1 = require("@/lib/appwriteImage");
var NewLaunchesSkeleton_1 = require("../skeleton/NewLaunchesSkeleton");
function HerbalSection() {
    var _a = react_1.useState([]), products = _a[0], setProducts = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    function fetchHerbalProducts() {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, appwrite_1.databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID, [
                                appwrite_2.Query.equal("isActive", true),
                                appwrite_2.Query.equal("homeSection", "herbal"),
                                appwrite_2.Query.orderDesc("$createdAt"),
                                appwrite_2.Query.limit(8),
                            ])];
                    case 1:
                        res = _a.sent();
                        setProducts(res.documents);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Herbal page fetch error:", err_1);
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
        fetchHerbalProducts();
    }, []);
    if (loading)
        return React.createElement(NewLaunchesSkeleton_1["default"], null);
    return (React.createElement(FeaturedCollection_1["default"], { title: "Herbal Products & Supplements", products: products.map(function (p) {
            var _a, _b;
            return ({
                id: p.$id,
                title: p.name,
                url: "/products/" + p.slug,
                image1: appwriteImage_1.getAppwriteImageUrl((_a = p.images) === null || _a === void 0 ? void 0 : _a[0], p.$updatedAt),
                image2: appwriteImage_1.getAppwriteImageUrl((_b = p.images) === null || _b === void 0 ? void 0 : _b[1], p.$updatedAt),
                badge: p.badge,
                rating: p.averagerating,
                ratingCount: p.reviewcount,
                price: "\u20B9" + p.price,
                compareAtPrice: p.marketprice
                    ? "\u20B9" + p.marketprice
                    : undefined
            });
        }), viewAllUrl: "" // already on herbal page
     }));
}
exports["default"] = HerbalSection;
