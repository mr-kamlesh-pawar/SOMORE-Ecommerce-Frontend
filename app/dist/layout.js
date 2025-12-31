"use strict";
exports.__esModule = true;
exports.metadata = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var utils_1 = require("@/lib/utils");
var ThemeProvider_1 = require("@/providers/ThemeProvider");
var ModalProvider_1 = require("@/providers/ModalProvider");
var CartContext_1 = require("@/store/context/CartContext");
var react_hot_toast_1 = require("react-hot-toast");
var AuthContext_1 = require("@/store/context/AuthContext");
var fontSans = google_1.Poppins({
    subsets: ["latin"],
    variable: "--font-sans",
    weight: ["300", "400", "500", "600", "700", "800"]
});
exports.metadata = {
    // Primary Title & Description
    title: {
        "default": "Somore Pure - Premium Ayurvedic & Herbal Wellness Products",
        template: "%s | Somore Pure - Authentic Ayurvedic Solutions"
    },
    description: "Discover 100% natural Ayurvedic & herbal products for holistic wellness. Authentic formulations for immunity, skincare, haircare, and overall well-being. Pure, organic, and chemical-free solutions.",
    // Icons & Favicons (using your existing files)
    icons: {
        icon: [
            { url: '/favicon.ico', type: 'image/x-icon' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
            {
                rel: 'apple-touch-icon',
                url: '/apple-touch-icon.png',
                sizes: '180x180'
            },
            {
                rel: 'icon',
                url: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                rel: 'icon',
                url: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            },
            {
                rel: 'manifest',
                url: '/site.webmanifest'
            },
        ]
    },
    // Keywords for SEO
    keywords: [
        "ayurvedic products",
        "herbal supplements",
        "natural wellness",
        "organic skincare",
        "ayurvedic medicine",
        "herbal remedies",
        "traditional medicine",
        "holistic health",
        "natural immunity boosters",
        "ayurvedic haircare",
        "herbal healthcare",
        "natural products India",
        "ayurvedic solutions",
        "wellness products",
        "chemical-free products",
    ],
    // Additional Metadata
    authors: [{ name: "Somore Pure" }],
    creator: "Somore Pure",
    publisher: "Somore Pure",
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    // Category (for e-commerce)
    category: "health & wellness"
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en", suppressHydrationWarning: true },
        React.createElement("body", { className: utils_1.cn("min-h-screen bg-background font-sans antialiased hide-scrollbar", fontSans.variable) },
            React.createElement(ThemeProvider_1.ThemeProvider, { attribute: "class", defaultTheme: "light", enableSystem: true, disableTransitionOnChange: true },
                React.createElement(AuthContext_1.AuthProvider, null,
                    React.createElement(CartContext_1.CartProvider, null,
                        children,
                        React.createElement(react_hot_toast_1.Toaster, { position: "top-center", reverseOrder: false }))),
                React.createElement(ModalProvider_1["default"], null)),
            React.createElement("script", { dangerouslySetInnerHTML: {
                    __html: "\n      if ('serviceWorker' in navigator) {\n        window.addEventListener('load', () => {\n          navigator.serviceWorker.register('/sw.js');\n        });\n      }\n    "
                } }))));
}
exports["default"] = RootLayout;
