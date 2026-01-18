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
var CartItemsDetails_1 = require("./CartItemsDetails");
var separator_1 = require("../ui/separator");
var button_1 = require("../ui/button");
var formatPrice_1 = require("@/lib/formatPrice");
var useCart_1 = require("@/store/hooks/useCart");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var react_hot_toast_1 = require("react-hot-toast");
var AuthContext_1 = require("@/store/context/AuthContext");
var order_service_1 = require("@/lib/order-service");
var OrderSummarySkeleton_1 = require("../skeleton/OrderSummarySkeleton");
var OrderSummaryForCheckout = function () {
    var _a = react_1.useState(false), isMounted = _a[0], setIsMounted = _a[1];
    var _b = react_1.useState(""), paymentMethod = _b[0], setPaymentMethod = _b[1];
    var _c = react_1.useState(false), isPlacingOrder = _c[0], setIsPlacingOrder = _c[1];
    var _d = react_1.useState(null), selectedAddress = _d[0], setSelectedAddress = _d[1];
    var _e = react_1.useState(true), checkingAddress = _e[0], setCheckingAddress = _e[1];
    var _f = useCart_1.useCart(), cartItems = _f.cartItems, getTotalPrice = _f.getTotalPrice, getTax = _f.getTax, getShippingFee = _f.getShippingFee, getTotalAmount = _f.getTotalAmount, dispatch = _f.dispatch, getCartCount = _f.getCartCount;
    var user = AuthContext_1.useAuth().user;
    var router = navigation_1.useRouter();
    // Memoized calculations
    var cartCount = react_1.useMemo(function () { return getCartCount(); }, [getCartCount]);
    var canProceed = react_1.useMemo(function () {
        return cartCount > 0 && selectedAddress && paymentMethod && !isPlacingOrder;
    }, [cartCount, selectedAddress, paymentMethod, isPlacingOrder]);
    // Load selected address from localStorage with debounce
    react_1.useEffect(function () {
        setIsMounted(true);
        var loadAddress = function () {
            try {
                var savedAddress = localStorage.getItem('selectedAddress');
                if (savedAddress) {
                    var parsedAddress = JSON.parse(savedAddress);
                    setSelectedAddress(parsedAddress);
                }
            }
            catch (e) {
                console.error("Error parsing saved address:", e);
            }
            finally {
                setCheckingAddress(false);
            }
        };
        loadAddress();
    }, []);
    // If no address selected, redirect to address selection
    react_1.useEffect(function () {
        if (isMounted && !checkingAddress && !selectedAddress) {
            react_hot_toast_1["default"].error("Please select a shipping address");
            router.push('/checkout');
        }
    }, [isMounted, checkingAddress, selectedAddress, router]);
    // Update localStorage when address changes
    react_1.useEffect(function () {
        if (selectedAddress) {
            localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
        }
    }, [selectedAddress]);
    // Validate cart items on mount
    react_1.useEffect(function () {
        if (cartCount === 0 && isMounted) {
            // toast.error("Your cart is empty");
            router.push('/cart');
        }
    }, [cartCount, isMounted, router]);
    var handlePlaceOrder = react_1.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var toastId, orderData, result_1, error_1, errorMessage;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // 🔐 Auth check
                    if (!user) {
                        react_hot_toast_1["default"].error("Please login to continue");
                        router.push("/login?redirect=/checkout");
                        return [2 /*return*/];
                    }
                    // 🏠 Address check
                    if (!selectedAddress) {
                        react_hot_toast_1["default"].error("Please select a shipping address");
                        router.push('/checkout');
                        return [2 /*return*/];
                    }
                    // 🛒 Cart validation
                    if (cartCount === 0) {
                        react_hot_toast_1["default"].error("Your cart is empty");
                        router.push('/cart');
                        return [2 /*return*/];
                    }
                    // 💳 Payment validation
                    if (!paymentMethod) {
                        react_hot_toast_1["default"].error("Please select a payment method");
                        return [2 /*return*/];
                    }
                    // 📞 Phone validation
                    if (!selectedAddress.mobileno || selectedAddress.mobileno.length < 10) {
                        react_hot_toast_1["default"].error("Please provide a valid phone number");
                        return [2 /*return*/];
                    }
                    setIsPlacingOrder(true);
                    toastId = react_hot_toast_1["default"].loading("Creating your order...");
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, 4, 5]);
                    orderData = {
                        userId: user.$id,
                        customerName: ((((_a = user.profile) === null || _a === void 0 ? void 0 : _a.firstName) || '') + " " + (((_b = user.profile) === null || _b === void 0 ? void 0 : _b.lastName) || '')).trim() || user.email.split('@')[0],
                        customerEmail: user.email,
                        customerPhone: ((_c = user.profile) === null || _c === void 0 ? void 0 : _c.phone) || selectedAddress.mobileno,
                        shippingAddress: selectedAddress,
                        address: selectedAddress.house + ", " + selectedAddress.area + ", " + selectedAddress.city + " - " + selectedAddress.pincode,
                        paymentMethod: paymentMethod,
                        cartItems: cartItems.map(function (item) { return ({
                            id: item.id,
                            productId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.images && item.images.length > 0 ? item.images[0] : ""
                        }); }),
                        shippingCost: getShippingFee(),
                        taxAmount: getTax(),
                        discountedAmount: 0,
                        totalAmount: getTotalAmount(),
                        notes: ""
                    };
                    return [4 /*yield*/, order_service_1.createOrder(orderData)];
                case 2:
                    result_1 = _e.sent();
                    if (result_1.success) {
                        // Clear cart
                        dispatch({ type: "CLEAR_CART" });
                        // Clear selected address from localStorage
                        localStorage.removeItem('selectedAddress');
                        react_hot_toast_1["default"].success("Order placed successfully! 🎉", { id: toastId });
                        // Redirect to success page with fade effect
                        setTimeout(function () {
                            router.push("/success?orderId=" + result_1.orderId + "&orderNumber=" + result_1.orderNumber);
                        }, 800);
                    }
                    else {
                        react_hot_toast_1["default"].error(result_1.error || "Failed to place order", { id: toastId });
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _e.sent();
                    console.error("Order error:", error_1);
                    errorMessage = ((_d = error_1.response) === null || _d === void 0 ? void 0 : _d.message) || error_1.message || "Failed to place order";
                    react_hot_toast_1["default"].error(errorMessage, { id: toastId });
                    return [3 /*break*/, 5];
                case 4:
                    setIsPlacingOrder(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [user, selectedAddress, cartCount, paymentMethod, cartItems, getShippingFee, getTax, getTotalAmount, dispatch, router]);
    if (!isMounted || checkingAddress) {
        return react_1["default"].createElement(OrderSummarySkeleton_1["default"], null);
    }
    // Empty cart handler
    var handleEmptyCartRedirect = function () {
        react_hot_toast_1["default"]("Add items to your cart to checkout", {
            icon: "🛒"
        });
        router.push('/products');
    };
    return (react_1["default"].createElement("div", { className: "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm" },
        react_1["default"].createElement("div", { className: "flex items-center justify-between mb-6" },
            react_1["default"].createElement("h2", { className: "text-xl font-semibold text-gray-900 dark:text-white" }, "Order Summary"),
            react_1["default"].createElement("div", { className: "flex items-center gap-2 text-sm text-gray-500" },
                react_1["default"].createElement(lucide_react_1.ShieldCheck, { size: 16, className: "text-green-600" }),
                react_1["default"].createElement("span", null, "Secure checkout"))),
        react_1["default"].createElement("div", { className: "mb-6" },
            react_1["default"].createElement("div", { className: "flex items-center justify-between mb-4" },
                react_1["default"].createElement("h3", { className: "font-medium text-gray-900 dark:text-white" },
                    "Order Items (",
                    cartCount,
                    ")"),
                react_1["default"].createElement("button", { onClick: function () { return router.push('/cart'); }, className: "text-sm text-green-600 hover:text-green-700 font-medium" }, "Edit Cart")),
            cartCount > 0 ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(CartItemsDetails_1["default"], null),
                react_1["default"].createElement(separator_1.Separator, { className: "my-4 dark:bg-gray-600" }))) : (react_1["default"].createElement("div", { className: "text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg" },
                react_1["default"].createElement("div", { className: "text-gray-400 mb-2" }, "\uD83D\uDED2"),
                react_1["default"].createElement("p", { className: "text-gray-500 mb-4" }, "Your cart is empty"),
                react_1["default"].createElement("button", { onClick: handleEmptyCartRedirect, className: "bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition" }, "Shop Products")))),
        selectedAddress && (react_1["default"].createElement("div", { className: "mb-6 p-4 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-lg" },
            react_1["default"].createElement("div", { className: "flex items-center gap-2 mb-3" },
                react_1["default"].createElement(lucide_react_1.MapPin, { className: "text-green-600", size: 18 }),
                react_1["default"].createElement("h3", { className: "font-semibold text-gray-900 dark:text-white" }, "Shipping Address")),
            react_1["default"].createElement("div", { className: "text-sm text-gray-700 dark:text-gray-300" },
                react_1["default"].createElement("p", { className: "font-medium" },
                    selectedAddress.house,
                    ", ",
                    selectedAddress.area),
                react_1["default"].createElement("p", { className: "text-gray-600 dark:text-gray-400" }, selectedAddress.addressLine),
                react_1["default"].createElement("p", { className: "text-gray-600 dark:text-gray-400" },
                    selectedAddress.city,
                    ", ",
                    selectedAddress.state,
                    " - ",
                    selectedAddress.pincode),
                react_1["default"].createElement("div", { className: "flex items-center gap-4 mt-2" },
                    react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" },
                        "\uD83D\uDCDE ",
                        selectedAddress.mobileno),
                    react_1["default"].createElement("span", { className: "px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full" }, selectedAddress.addressType))),
            react_1["default"].createElement("button", { onClick: function () { return router.push('/checkout/address'); }, className: "text-sm text-green-600 font-medium mt-3 hover:text-green-700 flex items-center gap-1" }, "Change Address"))),
        cartCount > 0 && (react_1["default"].createElement("div", { className: "mb-8" },
            react_1["default"].createElement("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4" }, "Order Summary"),
            react_1["default"].createElement("div", { className: "space-y-3 mb-4" },
                react_1["default"].createElement("div", { className: "flex justify-between" },
                    react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" },
                        "Subtotal (",
                        cartCount,
                        " items):"),
                    react_1["default"].createElement("span", { className: "font-medium" },
                        "\u20B9",
                        formatPrice_1.formatPrice(getTotalPrice()))),
                react_1["default"].createElement("div", { className: "flex justify-between" },
                    react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" }, "Shipping:"),
                    react_1["default"].createElement("span", { className: "font-medium" },
                        "\u20B9",
                        formatPrice_1.formatPrice(getShippingFee()))),
                react_1["default"].createElement("div", { className: "flex justify-between" },
                    react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" }, "Tax (10%):"),
                    react_1["default"].createElement("span", { className: "font-medium" },
                        "\u20B9",
                        formatPrice_1.formatPrice(getTax()))),
                react_1["default"].createElement(separator_1.Separator, { className: "my-3 dark:bg-gray-600" }),
                react_1["default"].createElement("div", { className: "flex justify-between text-lg font-bold" },
                    react_1["default"].createElement("span", { className: "text-gray-900 dark:text-white" }, "Total Amount:"),
                    react_1["default"].createElement("span", { className: "text-green-600" },
                        "\u20B9",
                        formatPrice_1.formatPrice(getTotalAmount())))),
            react_1["default"].createElement("div", { className: "mt-6" },
                react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-3" }, "Payment Method"),
                react_1["default"].createElement("div", { className: "space-y-3" },
                    react_1["default"].createElement("div", { className: "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all " + (paymentMethod === "cod"
                            ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"), onClick: function () { return setPaymentMethod("cod"); } },
                        react_1["default"].createElement("div", { className: "p-2 rounded-full " + (paymentMethod === "cod" ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-700") },
                            react_1["default"].createElement(lucide_react_1.Truck, { className: "" + (paymentMethod === "cod" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"), size: 20 })),
                        react_1["default"].createElement("div", { className: "flex-1" },
                            react_1["default"].createElement("span", { className: "font-medium text-gray-900 dark:text-white" }, "Cash on Delivery (COD)"),
                            react_1["default"].createElement("p", { className: "text-sm text-gray-500 dark:text-gray-400" }, "Pay when you receive your order")),
                        paymentMethod === "cod" && (react_1["default"].createElement("div", { className: "w-5 h-5 rounded-full bg-green-600 flex items-center justify-center" },
                            react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-white" })))),
                    react_1["default"].createElement("div", { className: "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all " + (paymentMethod === "online"
                            ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"), onClick: function () { return setPaymentMethod("online"); } },
                        react_1["default"].createElement("div", { className: "p-2 rounded-full " + (paymentMethod === "online" ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-700") },
                            react_1["default"].createElement(lucide_react_1.CreditCard, { className: "" + (paymentMethod === "online" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"), size: 20 })),
                        react_1["default"].createElement("div", { className: "flex-1" },
                            react_1["default"].createElement("span", { className: "font-medium text-gray-900 dark:text-white" }, "Online Payment"),
                            react_1["default"].createElement("p", { className: "text-sm text-gray-500 dark:text-gray-400" }, "Pay with UPI, Card, or Net Banking")),
                        paymentMethod === "online" && (react_1["default"].createElement("div", { className: "w-5 h-5 rounded-full bg-green-600 flex items-center justify-center" },
                            react_1["default"].createElement("div", { className: "w-2 h-2 rounded-full bg-white" }))))),
                paymentMethod === "cod" && (react_1["default"].createElement("div", { className: "mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg" },
                    react_1["default"].createElement("div", { className: "flex items-start gap-2" },
                        react_1["default"].createElement(lucide_react_1.AlertCircle, { size: 16, className: "text-yellow-600 dark:text-yellow-400 mt-0.5" }),
                        react_1["default"].createElement("p", { className: "text-sm text-yellow-700 dark:text-yellow-300" }, "Cash on Delivery may have additional verification. Please keep your ID proof ready."))))),
            react_1["default"].createElement(button_1.Button, { disabled: !canProceed, className: "w-full text-lg mt-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 rounded-xl font-semibold shadow-lg shadow-green-200 dark:shadow-green-900/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed", onClick: handlePlaceOrder }, isPlacingOrder ? (react_1["default"].createElement("span", { className: "flex items-center justify-center gap-2" },
                react_1["default"].createElement("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
                "Processing Order...")) : (react_1["default"].createElement("span", { className: "flex items-center justify-center gap-2" },
                react_1["default"].createElement(lucide_react_1.ShieldCheck, { size: 20 }),
                "Place Order - \u20B9",
                formatPrice_1.formatPrice(getTotalAmount())))),
            react_1["default"].createElement("div", { className: "mt-4 text-center" },
                react_1["default"].createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400" },
                    "By placing your order, you agree to our",
                    " ",
                    react_1["default"].createElement("a", { href: "/terms", className: "text-green-600 hover:underline" }, "Terms & Conditions"))),
            react_1["default"].createElement("div", { className: "mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700" },
                react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                    react_1["default"].createElement("div", { className: "p-2 bg-green-100 dark:bg-green-900 rounded-lg" },
                        react_1["default"].createElement(lucide_react_1.ShieldCheck, { size: 20, className: "text-green-600 dark:text-green-400" })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("p", { className: "text-sm font-medium text-gray-900 dark:text-white" }, "Secure & Encrypted"),
                        react_1["default"].createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400" }, "Your payment information is protected with 256-bit SSL encryption")))))),
        cartCount === 0 && (react_1["default"].createElement("div", { className: "text-center py-8" },
            react_1["default"].createElement("button", { onClick: handleEmptyCartRedirect, className: "w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition" }, "Continue Shopping")))));
};
exports["default"] = OrderSummaryForCheckout;
