import type { Metadata } from "next";
import { Poppins as FontSans } from "next/font/google";
// @ts-ignore - CSS import
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ModalProvider from "@/providers/ModalProvider";
import { CartProvider } from "@/store/context/CartContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/store/context/AuthContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  // Primary Title & Description
  title: {
    default: "Somore Pure - Premium Ayurvedic & Herbal Wellness Products",
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
        sizes: '180x180',
      },
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
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
    telephone: false,
  },
  

  
  
  // Category (for e-commerce)
  category: "health & wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased hide-scrollbar",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
              <AuthProvider>
             <CartProvider> 
              {children}
               <Toaster position="top-center" reverseOrder={false} />
              
              </CartProvider>

              </AuthProvider>
       
          <ModalProvider />
        </ThemeProvider>

<script
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    `,
  }}
/>


      </body>
    </html>
  );
}
