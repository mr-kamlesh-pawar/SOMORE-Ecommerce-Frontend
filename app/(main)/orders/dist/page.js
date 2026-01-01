// app/orders/page.tsx
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
var AuthContext_1 = require("@/store/context/AuthContext");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var link_1 = require("next/link");
var separator_1 = require("@/components/ui/separator");
var date_fns_1 = require("date-fns");
var OrderStatusBadge_1 = require("@/components/orders/OrderStatusBadge");
var OrdersPage = function () {
    var user = AuthContext_1.useAuth().user;
    var _a = react_1.useState([]), orders = _a[0], setOrders = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState('all'), activeFilter = _c[0], setActiveFilter = _c[1];
    var _d = react_1.useState(''), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = react_1.useState(null), expandedOrder = _e[0], setExpandedOrder = _e[1];
    // Mock data - Replace with actual API call
    var mockOrders = [
        {
            $id: 'order_1',
            orderNumber: 'ORD-20241215-001',
            userId: 'user_1',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '9876543210',
            shippingAddress: {},
            address: '101, MG Road, Mumbai - 400001',
            paymentMethod: 'cod',
            shippingCost: 5,
            taxAmount: 10.5,
            discountedAmount: 0,
            totalAmount: 115.5,
            orderStatus: 'delivered',
            paymentStatus: 'paid',
            notes: '',
            createdAt: '2024-12-10T10:30:00Z',
            items: [
                {
                    id: 'item_1',
                    productId: 'prod_1',
                    productName: 'Organic Moringa Powder',
                    price: 50,
                    quantity: 2,
                    totalPrice: 100,
                    image: '/images/products/moringa.jpg'
                }
            ]
        },
        {
            $id: 'order_2',
            orderNumber: 'ORD-20241214-002',
            userId: 'user_1',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '9876543210',
            shippingAddress: {},
            address: '101, MG Road, Mumbai - 400001',
            paymentMethod: 'online',
            shippingCost: 5,
            taxAmount: 8,
            discountedAmount: 10,
            totalAmount: 83,
            orderStatus: 'shipped',
            paymentStatus: 'paid',
            notes: '',
            createdAt: '2024-12-09T14:20:00Z',
            items: [
                {
                    id: 'item_2',
                    productId: 'prod_2',
                    productName: 'Ashwagandha Capsules',
                    price: 30,
                    quantity: 1,
                    totalPrice: 30,
                    image: '/images/products/ashwagandha.jpg'
                },
                {
                    id: 'item_3',
                    productId: 'prod_3',
                    productName: 'Turmeric Powder',
                    price: 20,
                    quantity: 2,
                    totalPrice: 40,
                    image: '/images/products/turmeric.jpg'
                }
            ]
        },
        {
            $id: 'order_3',
            orderNumber: 'ORD-20241213-003',
            userId: 'user_1',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            customerPhone: '9876543210',
            shippingAddress: {},
            address: '101, MG Road, Mumbai - 400001',
            paymentMethod: 'cod',
            shippingCost: 5,
            taxAmount: 5.5,
            discountedAmount: 0,
            totalAmount: 60.5,
            orderStatus: 'processing',
            paymentStatus: 'pending',
            notes: '',
            createdAt: '2024-12-08T09:15:00Z',
            items: [
                {
                    id: 'item_4',
                    productId: 'prod_4',
                    productName: 'Neem Capsules',
                    price: 25,
                    quantity: 2,
                    totalPrice: 50,
                    image: '/images/products/neem.jpg'
                }
            ]
        }
    ];
    react_1.useEffect(function () {
        var fetchOrders = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        setLoading(true);
                        // Simulate API delay
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                    case 2:
                        // Simulate API delay
                        _a.sent();
                        setOrders(mockOrders);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error fetching orders:', error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchOrders();
    }, [user]);
    // Filter orders
    var filteredOrders = orders.filter(function (order) {
        if (activeFilter === 'all')
            return true;
        if (activeFilter === 'recent') {
            var orderDate = new Date(order.createdAt);
            var thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return orderDate > thirtyDaysAgo;
        }
        return order.orderStatus === activeFilter;
    });
    // Get status icon
    var getStatusIcon = function (status) {
        switch (status) {
            case 'delivered': return react_1["default"].createElement(lucide_react_1.CheckCircle, { className: "text-green-600", size: 20 });
            case 'shipped': return react_1["default"].createElement(lucide_react_1.Truck, { className: "text-blue-600", size: 20 });
            case 'processing': return react_1["default"].createElement(lucide_react_1.RefreshCw, { className: "text-yellow-600", size: 20 });
            case 'pending': return react_1["default"].createElement(lucide_react_1.Clock, { className: "text-orange-600", size: 20 });
            case 'cancelled': return react_1["default"].createElement(lucide_react_1.AlertCircle, { className: "text-red-600", size: 20 });
            default: return react_1["default"].createElement(lucide_react_1.Package, { className: "text-gray-600", size: 20 });
        }
    };
    // Format date
    var formatDate = function (dateString) {
        try {
            return date_fns_1.format(new Date(dateString), 'MMM dd, yyyy');
        }
        catch (_a) {
            return 'Invalid date';
        }
    };
    if (!user) {
        return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900" },
            react_1["default"].createElement("div", { className: "container mx-auto px-4 py-16 text-center" },
                react_1["default"].createElement(lucide_react_1.Package, { className: "w-16 h-16 text-gray-300 mx-auto mb-6" }),
                react_1["default"].createElement("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4" }, "Please login to view your orders"),
                react_1["default"].createElement("p", { className: "text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto" }, "Sign in to access your order history, track shipments, and manage your purchases"),
                react_1["default"].createElement("div", { className: "space-y-4" },
                    react_1["default"].createElement(button_1.Button, { asChild: true, className: "bg-green-600 hover:bg-green-700 text-white px-8 py-3" },
                        react_1["default"].createElement(link_1["default"], { href: "/login?redirect=/orders" }, "Sign In")),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-4" },
                            "New customer?",
                            ' ',
                            react_1["default"].createElement(link_1["default"], { href: "/register", className: "text-green-600 hover:underline font-medium" }, "Create an account")))))));
    }
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900" },
        react_1["default"].createElement("div", { className: "bg-white dark:bg-gray-800 shadow-sm border-b" },
            react_1["default"].createElement("div", { className: "container mx-auto px-4 py-8" },
                react_1["default"].createElement("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4" },
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white" }, "My Orders"),
                        react_1["default"].createElement("p", { className: "text-gray-600 dark:text-gray-400 mt-2" }, "Track, return, or buy things again")),
                    react_1["default"].createElement("div", { className: "flex items-center gap-4" },
                        react_1["default"].createElement(button_1.Button, { variant: "outline", className: "hidden sm:flex items-center gap-2", asChild: true },
                            react_1["default"].createElement(link_1["default"], { href: "/products" }, "Continue Shopping")))))),
        react_1["default"].createElement("div", { className: "container mx-auto px-4 py-8" },
            react_1["default"].createElement("div", { className: "mb-8" },
                react_1["default"].createElement("div", { className: "flex flex-col md:flex-row gap-4 justify-between" },
                    react_1["default"].createElement("div", { className: "flex flex-wrap gap-2" },
                        react_1["default"].createElement("button", { onClick: function () { return setActiveFilter('all'); }, className: "px-4 py-2 rounded-full text-sm font-medium transition-colors " + (activeFilter === 'all' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700') }, "All Orders"),
                        react_1["default"].createElement("button", { onClick: function () { return setActiveFilter('recent'); }, className: "px-4 py-2 rounded-full text-sm font-medium transition-colors " + (activeFilter === 'recent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700') }, "Last 30 Days"),
                        react_1["default"].createElement("button", { onClick: function () { return setActiveFilter('delivered'); }, className: "px-4 py-2 rounded-full text-sm font-medium transition-colors " + (activeFilter === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700') }, "Delivered"),
                        react_1["default"].createElement("button", { onClick: function () { return setActiveFilter('shipped'); }, className: "px-4 py-2 rounded-full text-sm font-medium transition-colors " + (activeFilter === 'shipped' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700') }, "Shipped")),
                    react_1["default"].createElement("div", { className: "relative max-w-md w-full" },
                        react_1["default"].createElement(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }),
                        react_1["default"].createElement("input", { type: "text", placeholder: "Search orders...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500" })))),
            loading ? (react_1["default"].createElement("div", { className: "space-y-6" }, [1, 2, 3].map(function (i) { return (react_1["default"].createElement("div", { key: i, className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6" },
                react_1["default"].createElement("div", { className: "animate-pulse" },
                    react_1["default"].createElement("div", { className: "flex justify-between items-start mb-4" },
                        react_1["default"].createElement("div", { className: "space-y-2" },
                            react_1["default"].createElement("div", { className: "h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" }),
                            react_1["default"].createElement("div", { className: "h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" })),
                        react_1["default"].createElement("div", { className: "h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" })),
                    react_1["default"].createElement("div", { className: "h-px bg-gray-200 dark:bg-gray-700 my-4" }),
                    react_1["default"].createElement("div", { className: "space-y-3" },
                        react_1["default"].createElement("div", { className: "h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" }),
                        react_1["default"].createElement("div", { className: "h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" }),
                        react_1["default"].createElement("div", { className: "h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" }))))); }))) : filteredOrders.length === 0 ? (react_1["default"].createElement("div", { className: "text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700" },
                react_1["default"].createElement(lucide_react_1.Package, { className: "w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" }),
                react_1["default"].createElement("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2" }, activeFilter === 'all' ? 'No orders yet' : 'No orders found'),
                react_1["default"].createElement("p", { className: "text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto" }, activeFilter === 'all'
                    ? "When you place orders, they'll appear here for easy tracking and management."
                    : "Try changing your filters or search for different orders."),
                react_1["default"].createElement(button_1.Button, { asChild: true, className: "bg-green-600 hover:bg-green-700 text-white" },
                    react_1["default"].createElement(link_1["default"], { href: "/products" }, "Start Shopping")))) : (react_1["default"].createElement("div", { className: "space-y-6" }, filteredOrders.map(function (order) {
                var _a, _b, _c;
                return (react_1["default"].createElement("div", { key: order.$id, className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md" },
                    react_1["default"].createElement("div", { className: "p-6" },
                        react_1["default"].createElement("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4" },
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("div", { className: "flex items-center gap-3 mb-2" },
                                    react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white" },
                                        "Order #",
                                        order.orderNumber),
                                    react_1["default"].createElement(OrderStatusBadge_1["default"], { status: order.orderStatus })),
                                react_1["default"].createElement("div", { className: "flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400" },
                                    react_1["default"].createElement("div", { className: "flex items-center gap-1" },
                                        react_1["default"].createElement(lucide_react_1.Calendar, { size: 16 }),
                                        react_1["default"].createElement("span", null,
                                            "Placed on ",
                                            formatDate(order.createdAt))),
                                    react_1["default"].createElement("div", { className: "flex items-center gap-1" },
                                        react_1["default"].createElement(lucide_react_1.Package, { size: 16 }),
                                        react_1["default"].createElement("span", null,
                                            ((_a = order.items) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                            " items")),
                                    react_1["default"].createElement("div", { className: "flex items-center gap-1" },
                                        react_1["default"].createElement(lucide_react_1.IndianRupee, { size: 16 }),
                                        react_1["default"].createElement("span", { className: "font-medium" }, order.totalAmount.toFixed(2))))),
                            react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                                react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", className: "hidden sm:inline-flex items-center gap-2", onClick: function () { return setExpandedOrder(expandedOrder === order.$id ? null : order.$id); } },
                                    expandedOrder === order.$id ? 'Hide Details' : 'View Details',
                                    react_1["default"].createElement(lucide_react_1.ChevronRight, { size: 16, className: "transition-transform " + (expandedOrder === order.$id ? 'rotate-90' : '') })),
                                react_1["default"].createElement(button_1.Button, { size: "sm", className: "bg-green-600 hover:bg-green-700 text-white", asChild: true },
                                    react_1["default"].createElement(link_1["default"], { href: "/orders/" + order.$id },
                                        react_1["default"].createElement(lucide_react_1.Eye, { size: 16, className: "sm:hidden" }),
                                        react_1["default"].createElement("span", { className: "hidden sm:inline" }, "View Order")))))),
                    react_1["default"].createElement("div", { className: "px-6 pb-4" },
                        react_1["default"].createElement("div", { className: "flex overflow-x-auto gap-4 pb-2" }, (_b = order.items) === null || _b === void 0 ? void 0 :
                            _b.slice(0, 3).map(function (item, index) { return (react_1["default"].createElement("div", { key: item.id, className: "flex-shrink-0" },
                                react_1["default"].createElement("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg min-w-[200px]" },
                                    react_1["default"].createElement("div", { className: "w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center" }, item.image ? (react_1["default"].createElement("div", { className: "w-full h-full bg-gray-300 dark:bg-gray-600 rounded" })) : (react_1["default"].createElement(lucide_react_1.Package, { className: "text-gray-400", size: 20 }))),
                                    react_1["default"].createElement("div", null,
                                        react_1["default"].createElement("p", { className: "font-medium text-sm text-gray-900 dark:text-white line-clamp-1" }, item.productName),
                                        react_1["default"].createElement("p", { className: "text-xs text-gray-600 dark:text-gray-400" },
                                            "Qty: ",
                                            item.quantity,
                                            " \u00D7 \u20B9",
                                            item.price))))); }),
                            order.items && order.items.length > 3 && (react_1["default"].createElement("div", { className: "flex-shrink-0" },
                                react_1["default"].createElement("div", { className: "flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg min-w-[200px]" },
                                    react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" },
                                        "+",
                                        order.items.length - 3,
                                        " more items")))))),
                    expandedOrder === order.$id && (react_1["default"].createElement("div", { className: "border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50" },
                        react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white mb-3" }, "Order Items"),
                                react_1["default"].createElement("div", { className: "space-y-3" }, (_c = order.items) === null || _c === void 0 ? void 0 : _c.map(function (item) { return (react_1["default"].createElement("div", { key: item.id, className: "flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg" },
                                    react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                                        react_1["default"].createElement("div", { className: "w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center" },
                                            react_1["default"].createElement(lucide_react_1.Package, { size: 16, className: "text-gray-400" })),
                                        react_1["default"].createElement("div", null,
                                            react_1["default"].createElement("p", { className: "font-medium text-sm text-gray-900 dark:text-white" }, item.productName),
                                            react_1["default"].createElement("p", { className: "text-xs text-gray-600 dark:text-gray-400" },
                                                "Qty: ",
                                                item.quantity))),
                                    react_1["default"].createElement("div", { className: "text-right" },
                                        react_1["default"].createElement("p", { className: "font-medium text-gray-900 dark:text-white" },
                                            "\u20B9",
                                            item.totalPrice.toFixed(2)),
                                        react_1["default"].createElement("p", { className: "text-xs text-gray-600 dark:text-gray-400" },
                                            "\u20B9",
                                            item.price,
                                            " each")))); }))),
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white mb-3" }, "Order Summary"),
                                react_1["default"].createElement("div", { className: "space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg" },
                                    react_1["default"].createElement("div", { className: "flex justify-between text-sm" },
                                        react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" }, "Subtotal:"),
                                        react_1["default"].createElement("span", null,
                                            "\u20B9",
                                            (order.totalAmount - order.shippingCost - order.taxAmount + order.discountedAmount).toFixed(2))),
                                    react_1["default"].createElement("div", { className: "flex justify-between text-sm" },
                                        react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" }, "Shipping:"),
                                        react_1["default"].createElement("span", null,
                                            "\u20B9",
                                            order.shippingCost.toFixed(2))),
                                    react_1["default"].createElement("div", { className: "flex justify-between text-sm" },
                                        react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" }, "Tax:"),
                                        react_1["default"].createElement("span", null,
                                            "\u20B9",
                                            order.taxAmount.toFixed(2))),
                                    order.discountedAmount > 0 && (react_1["default"].createElement("div", { className: "flex justify-between text-sm" },
                                        react_1["default"].createElement("span", { className: "text-gray-600 dark:text-gray-400" }, "Discount:"),
                                        react_1["default"].createElement("span", { className: "text-green-600" },
                                            "-\u20B9",
                                            order.discountedAmount.toFixed(2)))),
                                    react_1["default"].createElement(separator_1.Separator, null),
                                    react_1["default"].createElement("div", { className: "flex justify-between font-semibold" },
                                        react_1["default"].createElement("span", { className: "text-gray-900 dark:text-white" }, "Total:"),
                                        react_1["default"].createElement("span", { className: "text-green-600" },
                                            "\u20B9",
                                            order.totalAmount.toFixed(2)))),
                                react_1["default"].createElement("div", { className: "mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg" },
                                    react_1["default"].createElement("h5", { className: "font-medium text-gray-900 dark:text-white mb-2" }, "Shipping Address"),
                                    react_1["default"].createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, order.address),
                                    react_1["default"].createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1" },
                                        "Phone: ",
                                        order.customerPhone)))),
                        react_1["default"].createElement("div", { className: "flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700" },
                            react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2" },
                                react_1["default"].createElement(lucide_react_1.Download, { size: 16 }),
                                "Invoice"),
                            order.orderStatus === 'delivered' && (react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2" },
                                react_1["default"].createElement(lucide_react_1.RefreshCw, { size: 16 }),
                                "Return/Replace")),
                            react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2" },
                                react_1["default"].createElement(lucide_react_1.Truck, { size: 16 }),
                                "Track Order"),
                            react_1["default"].createElement(button_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2 ml-auto" },
                                react_1["default"].createElement(lucide_react_1.Eye, { size: 16 }),
                                "View Full Details"))))));
            }))),
            !loading && filteredOrders.length > 0 && (react_1["default"].createElement("div", { className: "mt-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 rounded-xl p-6" },
                react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4" }, "Need Help With Your Orders?"),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
                    react_1["default"].createElement("div", { className: "text-center" },
                        react_1["default"].createElement("div", { className: "w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3" },
                            react_1["default"].createElement(lucide_react_1.Truck, { className: "text-green-600 dark:text-green-400", size: 24 })),
                        react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white mb-2" }, "Track Your Order"),
                        react_1["default"].createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, "Get real-time updates on your shipment")),
                    react_1["default"].createElement("div", { className: "text-center" },
                        react_1["default"].createElement("div", { className: "w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3" },
                            react_1["default"].createElement(lucide_react_1.RefreshCw, { className: "text-green-600 dark:text-green-400", size: 24 })),
                        react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white mb-2" }, "Returns & Refunds"),
                        react_1["default"].createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, "30-day return policy on most items")),
                    react_1["default"].createElement("div", { className: "text-center" },
                        react_1["default"].createElement("div", { className: "w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3" },
                            react_1["default"].createElement(lucide_react_1.AlertCircle, { className: "text-green-600 dark:text-green-400", size: 24 })),
                        react_1["default"].createElement("h4", { className: "font-medium text-gray-900 dark:text-white mb-2" }, "Need Help?"),
                        react_1["default"].createElement("p", { className: "text-sm text-gray-600 dark:text-gray-400" }, "Call us at 1800-123-4567"))))))));
};
exports["default"] = OrdersPage;
