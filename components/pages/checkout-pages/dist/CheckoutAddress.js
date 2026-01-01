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
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var AuthContext_1 = require("@/store/context/AuthContext");
var address_service_1 = require("@/lib/address-service");
var react_hot_toast_1 = require("react-hot-toast");
function CheckoutAddress(_a) {
    var _this = this;
    var onAddressSelect = _a.onAddressSelect;
    var router = navigation_1.useRouter();
    var user = AuthContext_1.useAuth().user;
    var _b = react_1.useState([]), addresses = _b[0], setAddresses = _b[1];
    var _c = react_1.useState(null), selectedAddressId = _c[0], setSelectedAddressId = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(false), hasSelectedAddress = _e[0], setHasSelectedAddress = _e[1];
    /* ================= FETCH ADDRESSES ================= */
    react_1.useEffect(function () {
        if (!user)
            return;
        var loadAddresses = function () { return __awaiter(_this, void 0, void 0, function () {
            var docs, savedAddress, parsedAddress, def, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, address_service_1.getUserAddresses(user.$id)];
                    case 1:
                        docs = _a.sent();
                        setAddresses(docs);
                        savedAddress = localStorage.getItem('selectedAddress');
                        if (savedAddress) {
                            parsedAddress = JSON.parse(savedAddress);
                            setSelectedAddressId(parsedAddress.$id);
                            setHasSelectedAddress(true);
                            // Call the callback if address is already selected
                            if (onAddressSelect) {
                                onAddressSelect();
                            }
                        }
                        else {
                            def = docs.find(function (a) { return a.isDefault; });
                            if (def) {
                                setSelectedAddressId(def.$id);
                                setHasSelectedAddress(true);
                                localStorage.setItem('selectedAddress', JSON.stringify(def));
                                // Call the callback when default address is auto-selected
                                if (onAddressSelect) {
                                    onAddressSelect();
                                }
                            }
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Failed to load addresses", err_1);
                        react_hot_toast_1["default"].error("Failed to load addresses");
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadAddresses();
    }, [user, onAddressSelect]);
    /* ================= SELECT ADDRESS ================= */
    var handleSelectAddress = function (address) {
        setSelectedAddressId(address.$id);
        setHasSelectedAddress(true);
        // Save to localStorage for checkout page
        localStorage.setItem('selectedAddress', JSON.stringify(address));
        // Call the callback when address is manually selected
        if (onAddressSelect) {
            onAddressSelect();
        }
        react_hot_toast_1["default"].success("Address selected", {
            icon: "📍",
            duration: 2000
        });
        // Optionally go back to checkout page after selection
        setTimeout(function () {
            router.push('/checkout');
        }, 500);
    };
    /* ================= UI ================= */
    if (loading) {
        return (React.createElement("div", { className: "bg-gray-100 dark:bg-gray-700 p-6 rounded-lg" },
            React.createElement("div", { className: "animate-pulse" },
                React.createElement("div", { className: "h-6 bg-gray-300 rounded w-1/3 mb-4" }),
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", { className: "h-24 bg-gray-300 rounded" }),
                    React.createElement("div", { className: "h-24 bg-gray-300 rounded" })))));
    }
    // Show selected address count in header
    var selectedCount = hasSelectedAddress ? 1 : 0;
    var totalCount = addresses.length;
    return (React.createElement("div", { className: "bg-gray-100 dark:bg-gray-700 p-6 rounded-lg" },
        React.createElement("div", { className: "flex items-center justify-between mb-6" },
            React.createElement("div", null,
                React.createElement("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white" }, "Select Shipping Address"),
                React.createElement("p", { className: "text-sm text-gray-500 mt-1" }, hasSelectedAddress
                    ? "Selected 1 of " + totalCount + " addresses"
                    : "Choose where you want your order delivered")),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement(lucide_react_1.MapPin, { className: "text-green-600", size: 24 }),
                hasSelectedAddress && (React.createElement("div", { className: "h-6 w-6 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center font-semibold" }, "\u2713")))),
        addresses.length > 0 ? (React.createElement("div", { className: "space-y-4" }, addresses.map(function (addr) { return (React.createElement("div", { key: addr.$id, onClick: function () { return handleSelectAddress(addr); }, className: "border p-4 rounded-lg cursor-pointer transition-all\n                " + (selectedAddressId === addr.$id
                ? "border-green-600 bg-green-50 dark:bg-green-900/20 shadow-sm"
                : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-white dark:hover:bg-gray-800") },
            React.createElement("div", { className: "flex justify-between items-start" },
                React.createElement("div", { className: "flex-1" },
                    React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                        React.createElement("p", { className: "font-semibold text-gray-900 dark:text-white" },
                            addr.house,
                            ", ",
                            addr.area),
                        addr.isDefault && (React.createElement("span", { className: "px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full" }, "Default")),
                        React.createElement("span", { className: "px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full" }, addr.addressType)),
                    React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-1" }, addr.addressLine),
                    addr.landmark && (React.createElement("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-1" },
                        React.createElement("span", { className: "font-medium" }, "Landmark:"),
                        " ",
                        addr.landmark)),
                    React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-1" },
                        addr.city,
                        ", ",
                        addr.state,
                        " - ",
                        addr.pincode),
                    React.createElement("p", { className: "text-sm text-gray-600 dark:text-gray-300" },
                        "\uD83D\uDCDE ",
                        addr.mobileno)),
                selectedAddressId === addr.$id && (React.createElement("div", { className: "w-6 h-6 rounded-full bg-green-600 flex items-center justify-center ml-4" },
                    React.createElement(lucide_react_1.Check, { size: 14, className: "text-white" })))))); }))) : (React.createElement("div", { className: "text-center py-8" },
            React.createElement(lucide_react_1.MapPin, { size: 48, className: "text-gray-300 dark:text-gray-600 mx-auto mb-4" }),
            React.createElement("p", { className: "text-gray-500 dark:text-gray-400 mb-2" }, "No saved addresses found"),
            React.createElement("p", { className: "text-sm text-gray-400 dark:text-gray-500 mb-6" }, "Add an address to proceed with checkout"))),
        React.createElement("div", { className: "mt-8 space-y-3" },
            React.createElement("button", { onClick: function () { return router.push("/account"); }, className: "w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg font-medium transition-colors" }, "+ Add New Address"),
            hasSelectedAddress && (React.createElement("button", { onClick: function () { return router.push('/checkout'); }, className: "w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors" }, "Continue with Selected Address"))),
        React.createElement("div", { className: "mt-12 pt-8 border-t dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-400" },
            React.createElement("p", null, "\uD83D\uDD12 Secure checkout | \uD83D\uDE9A Free shipping | \uD83D\uDCDE 24/7 Support"),
            React.createElement("p", { className: "mt-2" }, "Need help? Call us at 1800-123-4567 or email support@yourstore.com"))));
}
exports["default"] = CheckoutAddress;
