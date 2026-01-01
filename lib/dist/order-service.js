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
exports.updatePaymentStatus = exports.updateOrderStatus = exports.getOrderByNumber = exports.getOrderById = exports.getUserOrders = exports.createOrder = void 0;
// lib/order-service.ts
var appwrite_1 = require("@/lib/appwrite");
var appwrite_2 = require("appwrite");
var DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
var ORDERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID;
var ORDER_ITEMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDER_ITEMS_COLLECTION_ID;
// Generate order number
function generateOrderNumber() {
    var date = new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return "ORD-" + year + month + day + "-" + random;
}
// Create order based on your schema
function createOrder(orderData) {
    return __awaiter(this, void 0, void 0, function () {
        var orderNumber, addressDisplay, orderDoc_1, orderItemsPromises, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    orderNumber = generateOrderNumber();
                    addressDisplay = orderData.shippingAddress.house + ", " + orderData.shippingAddress.area + ", " + orderData.shippingAddress.city + " - " + orderData.shippingAddress.pincode;
                    return [4 /*yield*/, appwrite_1.databases.createDocument(DB_ID, ORDERS_COLLECTION_ID, appwrite_2.ID.unique(), {
                            orderNumber: orderNumber,
                            userId: orderData.userId,
                            customerName: orderData.customerName,
                            customerEmail: orderData.customerEmail,
                            customerPhone: orderData.customerPhone,
                            shippingAddress: JSON.stringify(orderData.shippingAddress),
                            address: addressDisplay,
                            paymentMethod: orderData.paymentMethod,
                            shippingCost: orderData.shippingCost,
                            taxAmount: orderData.taxAmount || 0,
                            discountedAmount: orderData.discountedAmount || 0,
                            totalAmount: orderData.totalAmount,
                            orderStatus: 'pending',
                            paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'pending',
                            notes: orderData.notes || ''
                        })];
                case 1:
                    orderDoc_1 = _a.sent();
                    orderItemsPromises = orderData.cartItems.map(function (item) {
                        return appwrite_1.databases.createDocument(DB_ID, ORDER_ITEMS_COLLECTION_ID, appwrite_2.ID.unique(), {
                            orderId: [orderDoc_1.$id],
                            productId: item.productId,
                            productName: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            totalPrice: item.price * item.quantity
                        });
                    });
                    return [4 /*yield*/, Promise.all(orderItemsPromises)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            orderId: orderDoc_1.$id,
                            orderNumber: orderDoc_1.orderNumber,
                            message: 'Order created successfully'
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error creating order:', error_1);
                    return [2 /*return*/, {
                            success: false,
                            error: error_1.message || 'Failed to create order'
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createOrder = createOrder;
// Get user orders
function getUserOrders(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var orders, parsedOrders, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, appwrite_1.databases.listDocuments(DB_ID, ORDERS_COLLECTION_ID, [
                            appwrite_2.Query.equal('userId', userId),
                            appwrite_2.Query.orderDesc('$createdAt'),
                            appwrite_2.Query.limit(50)
                        ])];
                case 1:
                    orders = _a.sent();
                    parsedOrders = orders.documents.map(function (order) { return (__assign(__assign({}, order), { shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null })); });
                    return [2 /*return*/, parsedOrders];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching orders:', error_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUserOrders = getUserOrders;
// Get order by ID
function getOrderById(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        var order, orderItems, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, appwrite_1.databases.getDocument(DB_ID, ORDERS_COLLECTION_ID, orderId)];
                case 1:
                    order = _a.sent();
                    return [4 /*yield*/, appwrite_1.databases.listDocuments(DB_ID, ORDER_ITEMS_COLLECTION_ID, [appwrite_2.Query.equal('orderId', orderId)])];
                case 2:
                    orderItems = _a.sent();
                    return [2 /*return*/, __assign(__assign({}, order), { items: orderItems.documents, shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null })];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error fetching order:', error_3);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getOrderById = getOrderById;
// Get order by order number
function getOrderByNumber(orderNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var orders, order, orderItems, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, appwrite_1.databases.listDocuments(DB_ID, ORDERS_COLLECTION_ID, [appwrite_2.Query.equal('orderNumber', orderNumber)])];
                case 1:
                    orders = _a.sent();
                    if (orders.documents.length === 0)
                        return [2 /*return*/, null];
                    order = orders.documents[0];
                    return [4 /*yield*/, appwrite_1.databases.listDocuments(DB_ID, ORDER_ITEMS_COLLECTION_ID, [appwrite_2.Query.equal('orderId', order.$id)])];
                case 2:
                    orderItems = _a.sent();
                    return [2 /*return*/, __assign(__assign({}, order), { items: orderItems.documents, shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null })];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error fetching order:', error_4);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getOrderByNumber = getOrderByNumber;
// Update order status
function updateOrderStatus(orderId, status) {
    return __awaiter(this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, appwrite_1.databases.updateDocument(DB_ID, ORDERS_COLLECTION_ID, orderId, { orderStatus: status })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error updating order status:', error_5);
                    return [2 /*return*/, { success: false, error: 'Failed to update order status' }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateOrderStatus = updateOrderStatus;
// Update payment status
function updatePaymentStatus(orderId, status) {
    return __awaiter(this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, appwrite_1.databases.updateDocument(DB_ID, ORDERS_COLLECTION_ID, orderId, { paymentStatus: status })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error updating payment status:', error_6);
                    return [2 /*return*/, { success: false, error: 'Failed to update payment status' }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updatePaymentStatus = updatePaymentStatus;
