"use client";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var logout_1 = require("@/lib/logout");
var AuthContext_1 = require("@/store/context/AuthContext");
var appwrite_1 = require("@/lib/appwrite");
var address_service_1 = require("@/lib/address-service");
var react_hot_toast_1 = require("react-hot-toast");
/* ---------------- CONFIG ---------------- */
var DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID;
var USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
/* ========================================================= */
function AccountPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = AuthContext_1.useAuth(), user = _a.user, isLoggedIn = _a.isLoggedIn, loading = _a.loading, refreshUser = _a.refreshUser;
    /* ---------------- STATE ---------------- */
    var _b = react_1.useState("profile"), currentTab = _b[0], setCurrentTab = _b[1];
    var _c = react_1.useState(false), editMode = _c[0], setEditMode = _c[1];
    var _d = react_1.useState(false), saving = _d[0], setSaving = _d[1];
    var _e = react_1.useState(false), mounted = _e[0], setMounted = _e[1];
    var _f = react_1.useState(false), sidebarOpen = _f[0], setSidebarOpen = _f[1];
    var _g = react_1.useState(false), isMobile = _g[0], setIsMobile = _g[1];
    var _h = react_1.useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    }), form = _h[0], setForm = _h[1];
    var _j = react_1.useState([]), addresses = _j[0], setAddresses = _j[1];
    var _k = react_1.useState(true), loadingAddresses = _k[0], setLoadingAddresses = _k[1];
    var _l = react_1.useState({
        house: "",
        area: "",
        addressLine: "",
        landmark: "",
        mobileno: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "Home",
        isDefault: false
    }), newAddress = _l[0], setNewAddress = _l[1];
    var _m = react_1.useState(false), showAddAddress = _m[0], setShowAddAddress = _m[1];
    var _o = react_1.useState(null), selectedAddressId = _o[0], setSelectedAddressId = _o[1];
    /* ---------------- SKELETON COMPONENTS (Moved to top to fix declaration order) ---------------- */
    var PageSkeleton = react_1.useCallback(function () { return (React.createElement("div", { className: "min-h-screen bg-gray-100" },
        React.createElement("div", { className: "container mx-auto px-4 py-8" },
            React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
                React.createElement("div", { className: "lg:col-span-1 bg-white rounded-xl p-6 shadow" },
                    React.createElement("div", { className: "flex flex-col items-center mb-8" },
                        React.createElement("div", { className: "w-20 h-20 rounded-full bg-gray-200 mb-3 animate-pulse" }),
                        React.createElement("div", { className: "h-6 w-32 bg-gray-200 mb-2 animate-pulse rounded" }),
                        React.createElement("div", { className: "h-4 w-48 bg-gray-200 animate-pulse rounded" })),
                    React.createElement("div", { className: "space-y-2" },
                        React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg animate-pulse" }),
                        React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg animate-pulse" }),
                        React.createElement("div", { className: "h-12 bg-gray-200 mt-6 rounded-lg animate-pulse" }))),
                React.createElement("div", { className: "lg:col-span-2" },
                    React.createElement("div", { className: "grid grid-cols-1 gap-6" },
                        React.createElement("div", { className: "bg-white rounded-xl p-6 shadow" },
                            React.createElement("div", { className: "h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" }),
                            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
                                React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg animate-pulse" }),
                                React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg animate-pulse" }),
                                React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" }),
                                React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" })),
                            React.createElement("div", { className: "h-12 w-40 bg-gray-200 rounded-lg animate-pulse" })),
                        React.createElement("div", { className: "bg-white rounded-xl p-6 shadow" },
                            React.createElement("div", { className: "h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" }),
                            React.createElement("div", { className: "space-y-4" }, [1, 2].map(function (i) { return (React.createElement("div", { key: i, className: "border p-4 rounded-lg" },
                                React.createElement("div", { className: "h-5 w-40 bg-gray-200 mb-2 animate-pulse rounded" }),
                                React.createElement("div", { className: "h-4 w-64 bg-gray-200 mb-1 animate-pulse rounded" }),
                                React.createElement("div", { className: "h-4 w-56 bg-gray-200 mb-1 animate-pulse rounded" }),
                                React.createElement("div", { className: "h-4 w-48 bg-gray-200 animate-pulse rounded" }))); }))))))))); }, []);
    var ProfileSkeleton = react_1.useCallback(function () { return (React.createElement("div", { className: "bg-white rounded-xl p-6 shadow" },
        React.createElement("div", { className: "h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" }),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
            React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg animate-pulse" }),
            React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg animate-pulse" }),
            React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" }),
            React.createElement("div", { className: "h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" })),
        React.createElement("div", { className: "h-12 w-40 bg-gray-200 rounded-lg animate-pulse" }))); }, []);
    var AddressSkeleton = react_1.useCallback(function () { return (React.createElement("div", { className: "bg-white rounded-xl p-6 shadow" },
        React.createElement("div", { className: "h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" }),
        React.createElement("div", { className: "space-y-4" }, [1, 2].map(function (i) { return (React.createElement("div", { key: i, className: "border p-4 rounded-lg" },
            React.createElement("div", { className: "h-5 w-40 bg-gray-200 mb-2 animate-pulse rounded" }),
            React.createElement("div", { className: "h-4 w-64 bg-gray-200 mb-1 animate-pulse rounded" }),
            React.createElement("div", { className: "h-4 w-56 bg-gray-200 mb-1 animate-pulse rounded" }),
            React.createElement("div", { className: "h-4 w-48 bg-gray-200 animate-pulse rounded" }))); })))); }, []);
    /* ---------------- RESPONSIVE HANDLING ---------------- */
    react_1.useEffect(function () {
        var checkMobile = function () {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return function () { return window.removeEventListener("resize", checkMobile); };
    }, []);
    /* ---------------- AUTH GUARD ---------------- */
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    react_1.useEffect(function () {
        var _a, _b, _c, _d;
        if (!loading && !isLoggedIn && mounted) {
            router.replace("/login");
        }
        if (user && mounted) {
            setForm({
                firstName: ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.firstName) || "",
                lastName: ((_b = user.profile) === null || _b === void 0 ? void 0 : _b.lastName) || "",
                email: user.email || "",
                phone: ((_c = user.profile) === null || _c === void 0 ? void 0 : _c.phone) || ""
            });
            if (!newAddress.mobileno && ((_d = user.profile) === null || _d === void 0 ? void 0 : _d.phone)) {
                setNewAddress(function (prev) { return (__assign(__assign({}, prev), { mobileno: user.profile.phone })); });
            }
        }
    }, [loading, isLoggedIn, user, router, mounted]);
    /* ---------------- LOAD ADDRESSES ---------------- */
    react_1.useEffect(function () {
        if (!user || !mounted)
            return;
        setLoadingAddresses(true);
        address_service_1.getUserAddresses(user.$id)
            .then(function (docs) {
            setAddresses(docs);
            var def = docs.find(function (a) { return a.isDefault; });
            if (def)
                setSelectedAddressId(def.$id);
        })["catch"](function () {
            react_hot_toast_1["default"].error("Failed to load addresses");
            console.error("Failed to load addresses");
        })["finally"](function () {
            setLoadingAddresses(false);
        });
    }, [user, mounted]);
    // Early returns - FIXED: These won't cause "Cannot update component while rendering"
    if (!mounted) {
        return React.createElement(PageSkeleton, null);
    }
    if (!isLoggedIn) {
        // Use setTimeout to avoid router.replace during render
        setTimeout(function () { return router.replace("/login"); }, 0);
        return React.createElement(PageSkeleton, null);
    }
    if (loading) {
        return React.createElement(PageSkeleton, null);
    }
    /* ---------------- HANDLERS ---------------- */
    var handleChange = function (e) {
        var _a;
        setForm(__assign(__assign({}, form), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
    var saveProfile = function () { return __awaiter(_this, void 0, void 0, function () {
        var toastId, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!form.firstName.trim()) {
                        react_hot_toast_1["default"].error("First name is required");
                        return [2 /*return*/];
                    }
                    if (!form.lastName.trim()) {
                        react_hot_toast_1["default"].error("Last name is required");
                        return [2 /*return*/];
                    }
                    if (!/^\d{10}$/.test(form.phone)) {
                        react_hot_toast_1["default"].error("Please enter a valid 10-digit mobile number");
                        return [2 /*return*/];
                    }
                    setSaving(true);
                    toastId = react_hot_toast_1["default"].loading("Saving profile...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, appwrite_1.databases.updateDocument(DB_ID, USERS_COLLECTION_ID, user.$id, {
                            firstName: form.firstName.trim(),
                            lastName: form.lastName.trim(),
                            phone: form.phone
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshUser()];
                case 3:
                    _a.sent();
                    setEditMode(false);
                    react_hot_toast_1["default"].success("Profile updated successfully", { id: toastId });
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    react_hot_toast_1["default"].error(err_1.message || "Failed to update profile", { id: toastId });
                    return [3 /*break*/, 6];
                case 5:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        var toastId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toastId = react_hot_toast_1["default"].loading("Logging out...");
                    return [4 /*yield*/, logout_1.logout()];
                case 1:
                    _a.sent();
                    react_hot_toast_1["default"].success("Logged out successfully", { id: toastId });
                    setTimeout(function () { return router.replace("/login"); }, 0);
                    return [2 /*return*/];
            }
        });
    }); };
    var addAddress = function () { return __awaiter(_this, void 0, void 0, function () {
        var toastId, doc_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newAddress.house.trim()) {
                        react_hot_toast_1["default"].error("House / Flat is required");
                        return [2 /*return*/];
                    }
                    if (!newAddress.area.trim()) {
                        react_hot_toast_1["default"].error("Area / Locality is required");
                        return [2 /*return*/];
                    }
                    if (!newAddress.addressLine.trim()) {
                        react_hot_toast_1["default"].error("Address line is required");
                        return [2 /*return*/];
                    }
                    if (!newAddress.city.trim()) {
                        react_hot_toast_1["default"].error("City is required");
                        return [2 /*return*/];
                    }
                    if (!newAddress.state.trim()) {
                        react_hot_toast_1["default"].error("State is required");
                        return [2 /*return*/];
                    }
                    if (!/^\d{6}$/.test(newAddress.pincode)) {
                        react_hot_toast_1["default"].error("Please enter a valid 6-digit pincode");
                        return [2 /*return*/];
                    }
                    if (!/^\d{10}$/.test(newAddress.mobileno)) {
                        react_hot_toast_1["default"].error("Please enter a valid 10-digit mobile number");
                        return [2 /*return*/];
                    }
                    toastId = react_hot_toast_1["default"].loading("Saving address...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, address_service_1.createAddress(user.$id, newAddress, addresses)];
                case 2:
                    doc_1 = _a.sent();
                    setAddresses(function (prev) { return __spreadArrays([doc_1], prev); });
                    setSelectedAddressId(doc_1.$id);
                    setShowAddAddress(false);
                    setNewAddress({
                        house: "",
                        area: "",
                        addressLine: "",
                        landmark: "",
                        city: "",
                        state: "",
                        pincode: "",
                        mobileno: form.phone || "",
                        addressType: "Home",
                        isDefault: false
                    });
                    react_hot_toast_1["default"].success("Address added successfully", { id: toastId });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    react_hot_toast_1["default"].error(err_2.message || "Failed to save address", { id: toastId });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var setDefaultAddress = function (addressId) { return __awaiter(_this, void 0, void 0, function () {
        var toastId, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    toastId = react_hot_toast_1["default"].loading("Updating default address...");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, address_service_1.setDefaultAddressService(addressId, addresses)];
                case 2:
                    _b.sent();
                    setAddresses(function (prev) {
                        return prev.map(function (a) { return (__assign(__assign({}, a), { isDefault: a.$id === addressId })); });
                    });
                    setSelectedAddressId(addressId);
                    react_hot_toast_1["default"].success("Default address updated", { id: toastId });
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    react_hot_toast_1["default"].error("Failed to set default address", { id: toastId });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var deleteAddress = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var toastId, remaining, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this address?"))
                        return [2 /*return*/];
                    toastId = react_hot_toast_1["default"].loading("Deleting address...");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, address_service_1.deleteAddressService(id, addresses)];
                case 2:
                    remaining = _b.sent();
                    setAddresses(remaining);
                    react_hot_toast_1["default"].success("Address deleted", { id: toastId });
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    react_hot_toast_1["default"].error("Failed to delete address", { id: toastId });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /* ---------------- SIDEBAR COMPONENT ---------------- */
    var Sidebar = function () {
        var _a, _b, _c, _d;
        return (React.createElement("aside", { className: "bg-white " + (isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300' : 'w-64') + " p-6 shadow-md h-full " + (sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0') },
            isMobile && (React.createElement("button", { onClick: function () { return setSidebarOpen(false); }, className: "absolute top-4 right-4 lg:hidden" },
                React.createElement(lucide_react_1.X, { size: 24 }))),
            React.createElement("div", { className: "flex flex-col items-center mb-8" },
                React.createElement("div", { className: "w-20 h-20 rounded-full bg-green-800 text-white flex items-center justify-center text-2xl font-semibold mb-3" },
                    ((_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.firstName) ? user.profile.firstName.charAt(0).toUpperCase()
                        : "U",
                    ((_b = user === null || user === void 0 ? void 0 : user.profile) === null || _b === void 0 ? void 0 : _b.lastName) ? user.profile.lastName.charAt(0).toUpperCase()
                        : ""),
                React.createElement("p", { className: "font-semibold text-center" },
                    ((_c = user === null || user === void 0 ? void 0 : user.profile) === null || _c === void 0 ? void 0 : _c.firstName) || "User",
                    " ",
                    ((_d = user === null || user === void 0 ? void 0 : user.profile) === null || _d === void 0 ? void 0 : _d.lastName) || ""),
                React.createElement("p", { className: "text-sm text-gray-600 text-center" }, user.email)),
            React.createElement("nav", { className: "space-y-2" },
                React.createElement("button", { onClick: function () {
                        setCurrentTab("profile");
                        if (isMobile)
                            setSidebarOpen(false);
                    }, className: "w-full flex items-center justify-between p-3 rounded-lg transition-colors " + (currentTab === "profile"
                        ? "bg-black text-white"
                        : "hover:bg-gray-100") },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement(lucide_react_1.User, { size: 18 }),
                        React.createElement("span", null, "My Profile")),
                    React.createElement(lucide_react_1.ChevronRight, { size: 16 })),
                React.createElement("button", { onClick: function () {
                        setCurrentTab("orders");
                        if (isMobile)
                            setSidebarOpen(false);
                    }, className: "w-full flex items-center justify-between p-3 rounded-lg transition-colors " + (currentTab === "orders"
                        ? "bg-black text-white"
                        : "hover:bg-gray-100") },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement(lucide_react_1.ShoppingBag, { size: 18 }),
                        React.createElement("span", null, "My Orders")),
                    React.createElement(lucide_react_1.ChevronRight, { size: 16 })),
                React.createElement("button", { onClick: handleLogout, className: "w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-red-50 text-red-600 mt-6" },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement(lucide_react_1.LogOut, { size: 18 }),
                        React.createElement("span", null, "Logout")),
                    React.createElement(lucide_react_1.ChevronRight, { size: 16 })))));
    };
    /* ========================================================= */
    /* ========================================================= */
    return (React.createElement("div", { className: "min-h-screen bg-gray-100" },
        isMobile && (React.createElement("header", { className: "sticky top-0 z-40 bg-white shadow-sm lg:hidden" },
            React.createElement("div", { className: "flex items-center justify-between p-4" },
                React.createElement("button", { onClick: function () { return setSidebarOpen(true); }, className: "p-2" },
                    React.createElement(lucide_react_1.Menu, { size: 24 })),
                React.createElement("h1", { className: "text-lg font-semibold" }, currentTab === "profile" ? "My Account" : "My Orders"),
                React.createElement("div", { className: "w-10" }),
                " "))),
        sidebarOpen && isMobile && (React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden", onClick: function () { return setSidebarOpen(false); } })),
        React.createElement("div", { className: "flex" },
            React.createElement(Sidebar, null),
            React.createElement("main", { className: "flex-1 p-4 lg:p-6 " + (isMobile ? 'pt-0' : '') },
                isMobile && currentTab === "profile" && (React.createElement("div", { className: "mb-4 lg:hidden" },
                    React.createElement("nav", { className: "text-sm text-gray-600" },
                        React.createElement("span", null, "Account"),
                        React.createElement(lucide_react_1.ChevronRight, { size: 14, className: "inline mx-1" }),
                        React.createElement("span", { className: "font-medium" }, "Profile")))),
                currentTab === "profile" && (React.createElement("div", { className: "space-y-6" },
                    isMobile && (React.createElement("div", { className: "lg:hidden" },
                        React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "My Profile"),
                        React.createElement("p", { className: "text-gray-600" }, "Manage your personal information"))),
                    React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
                        React.createElement("div", { className: "bg-white rounded-xl p-4 lg:p-6 shadow" },
                            React.createElement("div", { className: "flex items-center justify-between mb-6" },
                                React.createElement("h2", { className: "text-xl lg:text-2xl font-semibold" }, "Personal Information"),
                                !editMode && (React.createElement("button", { onClick: function () { return setEditMode(true); }, className: "text-sm lg:text-base border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors" }, "Edit"))),
                            React.createElement("div", { className: "space-y-4" },
                                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                                    React.createElement("div", null,
                                        React.createElement("label", { className: "block text-sm text-gray-600 mb-1" }, "First Name"),
                                        React.createElement("input", { name: "firstName", value: form.firstName, disabled: !editMode, onChange: handleChange, placeholder: "First Name", className: "w-full border px-4 py-3 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed" })),
                                    React.createElement("div", null,
                                        React.createElement("label", { className: "block text-sm text-gray-600 mb-1" }, "Last Name"),
                                        React.createElement("input", { name: "lastName", value: form.lastName, disabled: !editMode, onChange: handleChange, placeholder: "Last Name", className: "w-full border px-4 py-3 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed" }))),
                                React.createElement("div", null,
                                    React.createElement("label", { className: "block text-sm text-gray-600 mb-1" }, "Email"),
                                    React.createElement("input", { value: form.email, disabled: true, className: "w-full border px-4 py-3 rounded-lg bg-gray-50 cursor-not-allowed" })),
                                React.createElement("div", null,
                                    React.createElement("label", { className: "block text-sm text-gray-600 mb-1" }, "Mobile Number"),
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement("span", { className: "text-gray-500 bg-gray-50 px-3 py-3 rounded-l-lg border border-r-0" }, "+91"),
                                        React.createElement("input", { name: "phone", value: form.phone, disabled: !editMode, onChange: function (e) {
                                                var value = e.target.value.replace(/\D/g, "");
                                                if (value.length <= 10) {
                                                    setForm(__assign(__assign({}, form), { phone: value }));
                                                }
                                            }, placeholder: "Mobile Number", className: "flex-1 border px-4 py-3 rounded-r-lg disabled:bg-gray-50 disabled:cursor-not-allowed" }))),
                                editMode && (React.createElement("div", { className: "flex gap-3 pt-4" },
                                    React.createElement("button", { onClick: saveProfile, disabled: saving, className: "bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" },
                                        saving && React.createElement(lucide_react_1.Loader2, { size: 18, className: "animate-spin" }),
                                        saving ? "Saving..." : "Save Changes"),
                                    React.createElement("button", { onClick: function () {
                                            var _a, _b, _c;
                                            setEditMode(false);
                                            // Reset form to original values
                                            if (user) {
                                                setForm({
                                                    firstName: ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.firstName) || "",
                                                    lastName: ((_b = user.profile) === null || _b === void 0 ? void 0 : _b.lastName) || "",
                                                    email: user.email || "",
                                                    phone: ((_c = user.profile) === null || _c === void 0 ? void 0 : _c.phone) || ""
                                                });
                                            }
                                        }, className: "border px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors" }, "Cancel"))))),
                        React.createElement("div", { className: "bg-white rounded-xl p-4 lg:p-6 shadow" },
                            React.createElement("div", { className: "flex items-center justify-between mb-6" },
                                React.createElement("h2", { className: "text-xl lg:text-2xl font-semibold" }, "My Addresses"),
                                !showAddAddress && addresses.length > 0 && (React.createElement("button", { onClick: function () {
                                        setNewAddress(function (prev) { return (__assign(__assign({}, prev), { mobileno: form.phone || "" })); });
                                        setShowAddAddress(true);
                                    }, className: "text-sm lg:text-base bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors" }, "Add New"))),
                            loadingAddresses ? (React.createElement(AddressSkeleton, null)) : (React.createElement(React.Fragment, null,
                                addresses.length > 0 ? (React.createElement("div", { className: "space-y-4 mb-6" }, addresses.map(function (a) { return (React.createElement("div", { key: a.$id || a.id, className: "border rounded-lg p-4 " + (a.isDefault ? 'border-green-700 bg-green-50' : '') },
                                    React.createElement("div", { className: "flex justify-between items-start" },
                                        React.createElement("div", { className: "flex gap-3 flex-1" },
                                            React.createElement("input", { type: "radio", name: "defaultAddress", checked: a.isDefault, onChange: function () { return setDefaultAddress(a.$id); }, className: "mt-1" }),
                                            React.createElement("div", { className: "flex-1" },
                                                React.createElement("div", { className: "flex flex-wrap items-center gap-2 mb-2" },
                                                    React.createElement("p", { className: "font-semibold" },
                                                        a.house,
                                                        ", ",
                                                        a.area),
                                                    a.isDefault && (React.createElement("span", { className: "text-xs bg-green-700 text-white px-2 py-1 rounded-full" }, "Default"))),
                                                React.createElement("p", { className: "text-gray-600 text-sm mb-1" }, a.addressLine),
                                                a.landmark && (React.createElement("p", { className: "text-gray-500 text-sm mb-1" },
                                                    "Landmark: ",
                                                    a.landmark)),
                                                React.createElement("p", { className: "text-gray-600 text-sm mb-1" },
                                                    a.city,
                                                    ", ",
                                                    a.state,
                                                    " - ",
                                                    a.pincode),
                                                React.createElement("div", { className: "flex flex-wrap gap-4 mt-2" },
                                                    React.createElement("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded" }, a.addressType),
                                                    React.createElement("span", { className: "text-xs text-gray-500" },
                                                        "\uD83D\uDCF1 ",
                                                        a.mobileno)))),
                                        React.createElement("button", { onClick: function () { return deleteAddress(a.$id || a.id); }, className: "text-gray-400 hover:text-red-600 ml-2 transition-colors", "aria-label": "Delete address" },
                                            React.createElement(lucide_react_1.Trash, { size: 18 }))))); }))) : !showAddAddress && (React.createElement("div", { className: "text-center py-8" },
                                    React.createElement(lucide_react_1.MapPin, { size: 48, className: "text-gray-300 mx-auto mb-4" }),
                                    React.createElement("p", { className: "text-gray-500 mb-4" }, "No addresses added yet"),
                                    React.createElement("button", { onClick: function () {
                                            setNewAddress(function (prev) { return (__assign(__assign({}, prev), { mobileno: form.phone || "" })); });
                                            setShowAddAddress(true);
                                        }, className: "bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors" }, "Add Your First Address"))),
                                showAddAddress && (React.createElement("div", { className: "border-t pt-6" },
                                    React.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Add New Address"),
                                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
                                        [
                                            { label: "House / Flat", value: newAddress.house, field: "house" },
                                            { label: "Area / Locality", value: newAddress.area, field: "area" },
                                            { label: "Address Line", value: newAddress.addressLine, field: "addressLine", fullWidth: true },
                                            { label: "Landmark (Optional)", value: newAddress.landmark, field: "landmark", fullWidth: true },
                                            { label: "City", value: newAddress.city, field: "city" },
                                            { label: "State", value: newAddress.state, field: "state" },
                                            { label: "Pincode", value: newAddress.pincode, field: "pincode" },
                                        ].map(function (_a) {
                                            var label = _a.label, value = _a.value, field = _a.field, fullWidth = _a.fullWidth;
                                            return (React.createElement("div", { key: field, className: fullWidth ? "md:col-span-2" : "" },
                                                React.createElement("label", { className: "block text-sm text-gray-600 mb-1" }, label),
                                                React.createElement("input", { placeholder: label, value: value, onChange: function (e) {
                                                        var _a;
                                                        return setNewAddress(__assign(__assign({}, newAddress), (_a = {}, _a[field] = e.target.value, _a)));
                                                    }, className: "w-full border px-4 py-3 rounded-lg" })));
                                        }),
                                        React.createElement("div", null,
                                            React.createElement("label", { className: "block text-sm text-gray-600 mb-1" }, "Mobile Number"),
                                            React.createElement("div", { className: "flex items-center gap-2" },
                                                React.createElement("span", { className: "text-gray-500 bg-gray-50 px-3 py-3 rounded-l-lg border border-r-0" }, "+91"),
                                                React.createElement("input", { placeholder: "Mobile Number", value: newAddress.mobileno, onChange: function (e) {
                                                        var value = e.target.value.replace(/\D/g, "");
                                                        if (value.length <= 10) {
                                                            setNewAddress(__assign(__assign({}, newAddress), { mobileno: value }));
                                                        }
                                                    }, className: "flex-1 border px-4 py-3 rounded-r-lg" }))),
                                        React.createElement("div", null,
                                            React.createElement("label", { className: "block text-sm text-gray-600 mb-1" }, "Address Type"),
                                            React.createElement("select", { value: newAddress.addressType, onChange: function (e) {
                                                    return setNewAddress(__assign(__assign({}, newAddress), { addressType: e.target.value }));
                                                }, className: "w-full border px-4 py-3 rounded-lg" },
                                                React.createElement("option", { value: "Home" }, "Home"),
                                                React.createElement("option", { value: "Work" }, "Work"),
                                                React.createElement("option", { value: "Other" }, "Other")))),
                                    React.createElement("label", { className: "flex items-center gap-2 mb-4" },
                                        React.createElement("input", { type: "checkbox", checked: newAddress.isDefault, onChange: function (e) {
                                                return setNewAddress(__assign(__assign({}, newAddress), { isDefault: e.target.checked }));
                                            } }),
                                        "Make this my default address"),
                                    React.createElement("div", { className: "flex gap-3" },
                                        React.createElement("button", { onClick: addAddress, className: "bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors" }, "Save Address"),
                                        React.createElement("button", { onClick: function () { return setShowAddAddress(false); }, className: "border px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors" }, "Cancel")))))))))),
                currentTab === "orders" && (React.createElement("div", { className: "bg-white rounded-xl p-4 lg:p-6 shadow" },
                    React.createElement("h2", { className: "text-xl lg:text-2xl font-semibold mb-6" }, "My Orders"),
                    React.createElement("div", { className: "text-center py-12" },
                        React.createElement(lucide_react_1.ShoppingBag, { size: 64, className: "text-gray-300 mx-auto mb-4" }),
                        React.createElement("p", { className: "text-gray-600 text-lg mb-2" }, "No orders yet"),
                        React.createElement("p", { className: "text-gray-500 mb-6" }, "Start shopping to see your orders here"),
                        React.createElement("button", { onClick: function () { return router.push("/"); }, className: "bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors" }, "Start Shopping"))))))));
}
exports["default"] = AccountPage;
