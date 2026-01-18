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
var NewLaunches_1 = require("@/components/newLaunches/NewLaunches");
var appwriteImage_1 = require("@/lib/appwriteImage");
var NewLaunchesSkeleton_1 = require("../skeleton/NewLaunchesSkeleton");
function NewLaunchesSection() {
    var _a = react_1.useState([]), products = _a[0], setProducts = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    function fetchData() {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, appwrite_1.databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DB_ID, process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID, [
                            appwrite_2.Query.equal("isActive", true),
                            appwrite_2.Query.equal("homeSection", "new-launches"),
                            appwrite_2.Query.orderDesc("$createdAt"),
                            appwrite_2.Query.limit(4),
                        ])];
                    case 1:
                        res = _a.sent();
                        setProducts(res.documents);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        fetchData();
    }, []);
    if (loading)
        return React.createElement(NewLaunchesSkeleton_1["default"], null);
    return (React.createElement(NewLaunches_1["default"], { products: products.map(function (p) { return ({
            id: p.$id,
            slug: p.slug,
            title: p.name,
            price: p.price,
            badge: p.badge,
            compareAtPrice: p.marketprice,
            images: p.images && Array.isArray(p.images)
                ? p.images.map(function (id) {
                    return appwriteImage_1.getAppwriteImageUrl(id, p.$updatedAt);
                })
                : ["/images/placeholder.png"],
            isHome: true
        }); }), viewAllLink: "/products?category=New" }));
}
exports["default"] = NewLaunchesSection;
