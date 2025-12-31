"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var utils_1 = require("@/lib/utils");
var Logo_1 = require("../logo/Logo");
var AnnouncementBar_1 = require("./AnnouncementBar");
var useCart_1 = require("@/store/hooks/useCart");
var AuthContext_1 = require("@/store/context/AuthContext");
var HeaderOne = function () {
    var _a, _b;
    var pathname = navigation_1.usePathname();
    var router = navigation_1.useRouter();
    var _c = AuthContext_1.useAuth(), isLoggedIn = _c.isLoggedIn, user = _c.user;
    /* ---------------- MOUNT FIX ---------------- */
    var _d = react_1.useState(false), mounted = _d[0], setMounted = _d[1];
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    /* ---------------- UI STATE ---------------- */
    var _e = react_1.useState(false), mobileMenuOpen = _e[0], setMobileMenuOpen = _e[1];
    var _f = react_1.useState(false), searchOpen = _f[0], setSearchOpen = _f[1];
    var _g = react_1.useState(""), searchInput = _g[0], setSearchInput = _g[1];
    var _h = react_1.useState(false), scrolled = _h[0], setScrolled = _h[1];
    var _j = react_1.useState(null), activeDropdown = _j[0], setActiveDropdown = _j[1];
    /* ---------------- CART ---------------- */
    var getCartCount = useCart_1.useCart().getCartCount;
    var cartCount = mounted ? getCartCount() : 0;
    /* ---------------- SCROLL EFFECT ---------------- */
    react_1.useEffect(function () {
        var handleScroll = function () {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return function () { return window.removeEventListener("scroll", handleScroll); };
    }, []);
    /* ---------------- SEARCH HANDLER ---------------- */
    var handleSearch = react_1.useCallback(function () {
        if (!searchInput.trim())
            return;
        router.push("/search?query=" + encodeURIComponent(searchInput.trim()));
        setSearchOpen(false);
        setSearchInput("");
    }, [searchInput, router]);
    /* ---------------- NAVIGATION DATA ---------------- */
    var mainLinks = [
        { label: "Shop", link: "/shop", icon: react_1["default"].createElement(lucide_react_1.Package, { size: 16 }) },
        {
            label: "Categories",
            link: null,
            submenu: [
                { label: "Men's Health", link: "/mens-health", icon: react_1["default"].createElement(lucide_react_1.Activity, { size: 14 }) },
                { label: "Women's Health", link: "/womens-health", icon: react_1["default"].createElement(lucide_react_1.Heart, { size: 14 }) },
                { label: "Vitamins & Supplements", link: "/vitamins", icon: react_1["default"].createElement(lucide_react_1.Pill, { size: 14 }) },
                { label: "Ayurveda", link: "/ayurveda", icon: react_1["default"].createElement(lucide_react_1.Leaf, { size: 14 }) },
                { label: "Personal Care", link: "/personal-care", icon: react_1["default"].createElement(lucide_react_1.Sparkles, { size: 14 }) },
            ]
        },
        { label: "Combos", link: "/combos", badge: "" },
        {
            label: "Links",
            link: null,
            icon: react_1["default"].createElement(lucide_react_1.Info, { size: 16 }),
            submenu: [
                { label: "About Us", link: "/about", icon: react_1["default"].createElement(lucide_react_1.Info, { size: 14 }) },
                { label: "Contact", link: "/contact", icon: react_1["default"].createElement(lucide_react_1.Mail, { size: 14 }) },
                { label: "Blog", link: "/blog", icon: react_1["default"].createElement(lucide_react_1.FileText, { size: 14 }) },
                { label: "Bulk Orders", link: "/bulk-order", icon: react_1["default"].createElement(lucide_react_1.Briefcase, { size: 14 }) },
            ]
        },
    ];
    var utilityLinks = [
        {
            label: isLoggedIn ? "My Account" : "Login",
            link: "/account",
            icon: react_1["default"].createElement(lucide_react_1.User, { size: 18 }),
            submenu: isLoggedIn ? [
                { label: "Profile", link: "/account" },
                { label: "Orders", link: "/account?tab=orders" },
                { label: "Addresses", link: "/account?tab=addresses" },
                { label: "Logout", link: "/logout" }
            ] : undefined
        },
        {
            label: "Cart",
            link: "/cart",
            icon: react_1["default"].createElement(lucide_react_1.ShoppingCart, { size: 18 }),
            count: cartCount
        },
    ];
    /* ---------------- RESPONSIVE HANDLERS ---------------- */
    var toggleDropdown = react_1.useCallback(function (menu) {
        setActiveDropdown(activeDropdown === menu ? null : menu);
    }, [activeDropdown]);
    var closeAllMenus = react_1.useCallback(function () {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setActiveDropdown(null);
    }, []);
    /* ---------------- KEYBOARD NAVIGATION ---------------- */
    react_1.useEffect(function () {
        var handleEscape = function (e) {
            if (e.key === "Escape")
                closeAllMenus();
            if (e.key === "/" && e.ctrlKey) {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return function () { return window.removeEventListener("keydown", handleEscape); };
    }, [closeAllMenus]);
    /* 🚨 Prevent server/client mismatch */
    if (!mounted)
        return null;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("header", { className: utils_1.cn("sticky top-0 z-50 bg-white border-b shadow-sm transition-all duration-300", scrolled && "shadow-lg") },
            react_1["default"].createElement(AnnouncementBar_1["default"], null),
            react_1["default"].createElement("div", { className: "max-w-7xl mx-auto px-3 sm:px-4 lg:px-6" },
                react_1["default"].createElement("div", { className: "flex items-center justify-between py-2 lg:py-3" },
                    react_1["default"].createElement("button", { onClick: function () { return setMobileMenuOpen(true); }, className: "lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors", "aria-label": "Open menu" },
                        react_1["default"].createElement(lucide_react_1.Menu, { size: 24 })),
                    react_1["default"].createElement("div", { className: "lg:flex-1 flex justify-center lg:justify-start" },
                        react_1["default"].createElement(link_1["default"], { href: "/", className: "inline-block", onClick: closeAllMenus },
                            react_1["default"].createElement(Logo_1["default"], null))),
                    react_1["default"].createElement("nav", { className: "hidden lg:flex items-center gap-1 mx-6 flex-1 justify-center" }, mainLinks.map(function (item) { return (react_1["default"].createElement("div", { key: item.label, className: "relative group", onMouseEnter: function () { return item.submenu && setActiveDropdown(item.label); }, onMouseLeave: function () { return item.submenu && setActiveDropdown(null); } },
                        item.link ? (react_1["default"].createElement(link_1["default"], { href: item.link, className: utils_1.cn("flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200", pathname.startsWith(item.link) && "text-green-800 bg-green-50") },
                            item.icon && react_1["default"].createElement("span", { className: "mr-1" }, item.icon),
                            item.label,
                            item.badge && (react_1["default"].createElement("span", { className: "ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full" }, item.badge)),
                            item.submenu && react_1["default"].createElement(lucide_react_1.ChevronDown, { size: 16, className: "ml-1" }))) : (react_1["default"].createElement("button", { className: utils_1.cn("flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 cursor-pointer", activeDropdown === item.label && "text-green-800 bg-green-50"), onClick: function () { return toggleDropdown(item.label); } },
                            item.icon && react_1["default"].createElement("span", { className: "mr-1" }, item.icon),
                            item.label,
                            item.submenu && react_1["default"].createElement(lucide_react_1.ChevronDown, { size: 16, className: "ml-1" }))),
                        item.submenu && activeDropdown === item.label && (react_1["default"].createElement("div", { className: "absolute top-full left-0 w-56 mt-1 bg-white border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200" }, item.submenu.map(function (subItem) { return (react_1["default"].createElement(link_1["default"], { key: subItem.link, href: subItem.link, className: "flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors", onClick: closeAllMenus },
                            subItem.icon && subItem.icon,
                            subItem.label)); }))))); })),
                    react_1["default"].createElement("div", { className: "flex items-center gap-1 lg:gap-2 " },
                        react_1["default"].createElement("div", { className: "hidden lg:block relative" },
                            react_1["default"].createElement("button", { onClick: function () { return setSearchOpen(true); }, className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", "aria-label": "Search" },
                                react_1["default"].createElement(lucide_react_1.Search, { size: 20 }))),
                        react_1["default"].createElement("button", { onClick: function () { return setSearchOpen(true); }, className: "lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors", "aria-label": "Search" },
                            react_1["default"].createElement(lucide_react_1.Search, { size: 20 })),
                        utilityLinks.map(function (item) { return (react_1["default"].createElement("div", { key: item.label, className: "relative group" },
                            react_1["default"].createElement(link_1["default"], { href: item.link, className: utils_1.cn("relative p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1", pathname.startsWith(item.link) && "text-green-800"), onClick: function (e) {
                                    if (item.submenu) {
                                        e.preventDefault();
                                        toggleDropdown(item.label);
                                    }
                                } },
                                item.icon,
                                react_1["default"].createElement("span", { className: "hidden lg:inline text-sm font-medium" }, item.label),
                                item.count > 0 && (react_1["default"].createElement("span", { className: utils_1.cn("absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center", "bg-green-700 text-white") }, item.count > 99 ? "99+" : item.count)),
                                item.submenu && react_1["default"].createElement(lucide_react_1.ChevronDown, { size: 14, className: "hidden lg:block" })),
                            item.submenu && activeDropdown === item.label && (react_1["default"].createElement("div", { className: "absolute right-0 top-full mt-1 w-48 bg-white border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200" }, item.submenu.map(function (subItem) { return (react_1["default"].createElement(link_1["default"], { key: subItem.link, href: subItem.link, className: "flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors text-sm", onClick: closeAllMenus }, subItem.label)); }))))); })))),
            react_1["default"].createElement("div", { className: utils_1.cn("fixed inset-0 z-[100] transition-all duration-300", mobileMenuOpen
                    ? "bg-black bg-opacity-50"
                    : "pointer-events-none") },
                react_1["default"].createElement("div", { className: utils_1.cn("fixed inset-y-0 left-0 w-80 sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out", mobileMenuOpen ? "translate-x-0" : "-translate-x-full") },
                    react_1["default"].createElement("div", { className: "p-4 border-b flex items-center justify-between" },
                        react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                            isLoggedIn && ((_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.firstName) && (react_1["default"].createElement("div", { className: "w-8 h-8 rounded-full bg-green-100 flex items-center justify-center" },
                                react_1["default"].createElement("span", { className: "text-green-800 font-semibold text-sm" }, user.profile.firstName.charAt(0)))),
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("p", { className: "font-semibold" }, isLoggedIn
                                    ? "Hello, " + (((_b = user === null || user === void 0 ? void 0 : user.profile) === null || _b === void 0 ? void 0 : _b.firstName) || "User")
                                    : "Welcome"),
                                react_1["default"].createElement("p", { className: "text-xs text-gray-500" }, isLoggedIn ? user === null || user === void 0 ? void 0 : user.email : "Sign in for better experience"))),
                        react_1["default"].createElement("button", { onClick: closeAllMenus, className: "p-2 rounded-lg hover:bg-gray-100", "aria-label": "Close menu" },
                            react_1["default"].createElement(lucide_react_1.X, { size: 22 }))),
                    react_1["default"].createElement("div", { className: "h-[calc(100vh-80px)] overflow-y-auto p-4" },
                        react_1["default"].createElement("div", { className: "grid grid-cols-2 gap-3 mb-6" },
                            react_1["default"].createElement(link_1["default"], { href: isLoggedIn ? "/account" : "/login", className: "p-3 border rounded-lg text-center hover:bg-green-50 transition-colors", onClick: closeAllMenus },
                                react_1["default"].createElement(lucide_react_1.User, { size: 20, className: "mx-auto mb-2" }),
                                react_1["default"].createElement("span", { className: "text-sm font-medium" }, "Account")),
                            react_1["default"].createElement(link_1["default"], { href: "/orders", className: "p-3 border rounded-lg text-center hover:bg-green-50 transition-colors", onClick: closeAllMenus },
                                react_1["default"].createElement(lucide_react_1.Package, { size: 20, className: "mx-auto mb-2" }),
                                react_1["default"].createElement("span", { className: "text-sm font-medium" }, "Orders"))),
                        react_1["default"].createElement("nav", { className: "space-y-1" }, mainLinks.map(function (item) { return (react_1["default"].createElement("div", { key: item.label },
                            item.link ? (react_1["default"].createElement(link_1["default"], { href: item.link, className: "flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group", onClick: function () { return !item.submenu && closeAllMenus(); } },
                                react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                                    item.icon,
                                    react_1["default"].createElement("span", { className: "font-medium" }, item.label)),
                                item.badge && (react_1["default"].createElement("span", { className: "px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full" }, item.badge)),
                                item.submenu && react_1["default"].createElement(lucide_react_1.ChevronDown, { size: 16 }))) : (
                            // In mobile, show "Links" as a header without click
                            react_1["default"].createElement("div", { className: "flex items-center justify-between p-3 rounded-lg group" },
                                react_1["default"].createElement("div", { className: "flex items-center gap-3" },
                                    item.icon,
                                    react_1["default"].createElement("span", { className: "font-medium text-gray-400" }, item.label)))),
                            item.submenu && (react_1["default"].createElement("div", { className: utils_1.cn("space-y-1", !item.link && "ml-4 pl-4 border-l" // Only indent if it's the "Links" dropdown
                                ) }, item.submenu.map(function (subItem) { return (react_1["default"].createElement(link_1["default"], { key: subItem.link, href: subItem.link, className: "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors", onClick: closeAllMenus },
                                subItem.icon && subItem.icon,
                                react_1["default"].createElement("span", null, subItem.label))); }))))); })),
                        react_1["default"].createElement("div", { className: "mt-8 p-4 bg-gray-50 rounded-xl" },
                            react_1["default"].createElement("h4", { className: "font-semibold mb-2" }, "Need Help?"),
                            react_1["default"].createElement("div", { className: "space-y-2 text-sm" },
                                react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                                    react_1["default"].createElement(lucide_react_1.Phone, { size: 14 }),
                                    react_1["default"].createElement("span", null, "1800-123-4567")),
                                react_1["default"].createElement("p", { className: "text-gray-600" }, "Mon-Sat: 9:00 AM - 7:00 PM")))))),
            react_1["default"].createElement("div", { className: utils_1.cn("fixed inset-0 z-[100] transition-all duration-300", searchOpen
                    ? "bg-black bg-opacity-50"
                    : "pointer-events-none") },
                react_1["default"].createElement("div", { className: utils_1.cn("fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out", searchOpen ? "translate-y-0" : "-translate-y-full") },
                    react_1["default"].createElement("div", { className: "max-w-3xl mx-auto h-full flex flex-col" },
                        react_1["default"].createElement("div", { className: "p-4 border-b flex items-center gap-4" },
                            react_1["default"].createElement("button", { onClick: closeAllMenus, className: "p-2 rounded-lg hover:bg-gray-100", "aria-label": "Close search" },
                                react_1["default"].createElement(lucide_react_1.X, { size: 22 })),
                            react_1["default"].createElement("div", { className: "flex-1 relative" },
                                react_1["default"].createElement(lucide_react_1.Search, { size: 20, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
                                react_1["default"].createElement("input", { type: "search", placeholder: "Search for products, categories, or brands...", className: "w-full pl-10 pr-4 py-3 border-0 bg-gray-100 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500", value: searchInput, onChange: function (e) { return setSearchInput(e.target.value); }, onKeyDown: function (e) { return e.key === "Enter" && handleSearch(); }, autoFocus: true })),
                            react_1["default"].createElement("button", { onClick: handleSearch, className: "px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors" }, "Search")),
                        react_1["default"].createElement("div", { className: "flex-1 overflow-y-auto p-6" },
                            react_1["default"].createElement("h3", { className: "text-sm font-medium text-gray-500 mb-4" }, "Popular Searches"),
                            react_1["default"].createElement("div", { className: "flex flex-wrap gap-2" }, ["Protein Powder", "Vitamin D", "Ashwagandha", "Fish Oil", "Multivitamin", "Hair Care"].map(function (term) { return (react_1["default"].createElement("button", { key: term, onClick: function () {
                                    setSearchInput(term);
                                    handleSearch();
                                }, className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors" }, term)); })))))))));
};
exports["default"] = HeaderOne;
