"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  ChevronDown, 
  Phone,
  MapPin,
  Package,
  Info,
  Mail,
  FileText,
  Briefcase,   Heart,
  Activity,
  Pill,
  Leaf,
  Sparkles
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../logo/Logo";
import AnnouncementBar from "./AnnouncementBar";
import { useCart } from "@/store/hooks/useCart";
import { useAuth } from "@/store/context/AuthContext";

const HeaderOne = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  /* ---------------- MOUNT FIX ---------------- */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- UI STATE ---------------- */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  /* ---------------- CART ---------------- */
  const { getCartCount } = useCart();
  const cartCount = mounted ? getCartCount() : 0;

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- SEARCH HANDLER ---------------- */
  const handleSearch = useCallback(() => {
    if (!searchInput.trim()) return;
    router.push(`/search?query=${encodeURIComponent(searchInput.trim())}`);
    setSearchOpen(false);
    setSearchInput("");
  }, [searchInput, router]);

  /* ---------------- NAVIGATION DATA ---------------- */
  const mainLinks = [
    { label: "Shop", link: "/shop", icon: <Package size={16} /> },
    { 
      label: "Categories", 
      link: null,
    submenu: [
  { label: "Men's Health", link: "/mens-health", icon: <Activity size={14} /> },
  { label: "Women's Health", link: "/womens-health", icon: <Heart size={14} /> },
  { label: "Vitamins & Supplements", link: "/vitamins", icon: <Pill size={14} /> },
  { label: "Ayurveda", link: "/ayurveda", icon: <Leaf size={14} /> },
  { label: "Personal Care", link: "/personal-care", icon: <Sparkles size={14} /> },
]
    },
    { label: "Combos", link: "/combos", badge: "" },
    { 
      label: "Links", 
      link: null, // No link - just a dropdown
      icon: <Info size={16} />,
      submenu: [
        { label: "About Us", link: "/about", icon: <Info size={14} /> },
        { label: "Contact", link: "/contact", icon: <Mail size={14} /> },
        { label: "Blog", link: "/blog", icon: <FileText size={14} /> },
        { label: "Bulk Orders", link: "/bulk-order", icon: <Briefcase size={14} /> },
      ]
    },
  ];

  const utilityLinks = [
    { 
      label: isLoggedIn ? "My Account" : "Login", 
      link: "/account", 
      icon: <User size={18} />,
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
      icon: <ShoppingCart size={18} />, 
      count: cartCount 
    },
  ];

  /* ---------------- RESPONSIVE HANDLERS ---------------- */
  const toggleDropdown = useCallback((menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  }, [activeDropdown]);

  const closeAllMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, []);

  /* ---------------- KEYBOARD NAVIGATION ---------------- */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAllMenus();
      if (e.key === "/" && e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeAllMenus]);

  /* 🚨 Prevent server/client mismatch */
  if (!mounted) return null;

  return (
    <>
      {/* TOP BAR - Contact & Location */}
     

      {/* MAIN HEADER */}
      <header className={cn(
        "sticky top-0 z-50 bg-white border-b shadow-sm transition-all duration-300",
        scrolled && "shadow-lg"
      )}>

        <AnnouncementBar />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          
          {/* MAIN NAV ROW */}
          <div className="flex items-center justify-between py-2 lg:py-3">
            
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* LOGO */}
            <div className="lg:flex-1 flex justify-center lg:justify-start">
              <Link href="/" className="inline-block" onClick={closeAllMenus}>
                <Logo />
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-1 mx-6 flex-1 justify-center">
              {mainLinks.map((item) => (
                <div 
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => item.submenu && setActiveDropdown(null)}
                >
                  {/* DESKTOP NAV ITEM - With link if available, otherwise just a button */}
                  {item.link ? (
                    <Link
                      href={item.link}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200",
                        pathname.startsWith(item.link) && "text-green-800 bg-green-50"
                      )}
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && <ChevronDown size={16} className="ml-1" />}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 cursor-pointer",
                        activeDropdown === item.label && "text-green-800 bg-green-50"
                      )}
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      {item.label}
                      {item.submenu && <ChevronDown size={16} className="ml-1" />}
                    </button>
                  )}

                  {/* DESKTOP DROPDOWN */}
                  {item.submenu && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 w-56 mt-1 bg-white border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.link}
                          href={subItem.link}
                          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                          onClick={closeAllMenus}
                        >
                          {subItem.icon && subItem.icon}
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-1 lg:gap-2 ">
              
              {/* SEARCH - Desktop */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </div>

              {/* SEARCH - Mobile */}
              <button
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* UTILITY LINKS */}
              {utilityLinks.map((item) => (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.link}
                    className={cn(
                      "relative p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1",
                      pathname.startsWith(item.link) && "text-green-800"
                    )}
                    onClick={(e) => {
                      if (item.submenu) {
                        e.preventDefault();
                        toggleDropdown(item.label);
                      }
                    }}
                  >
                    {item.icon}
                    <span className="hidden lg:inline text-sm font-medium">
                      {item.label}
                    </span>
                    {item.count > 0 && (
                      <span className={cn(
                        "absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center",
                        "bg-green-700 text-white"
                      )}>
                        {item.count > 99 ? "99+" : item.count}
                      </span>
                    )}
                    {item.submenu && <ChevronDown size={14} className="hidden lg:block" />}
                  </Link>

                  {/* ACCOUNT DROPDOWN */}
                  {item.submenu && activeDropdown === item.label && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.link}
                          href={subItem.link}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors text-sm"
                          onClick={closeAllMenus}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div className={cn(
          "fixed inset-0 z-[100] transition-all duration-300",
          mobileMenuOpen 
            ? "bg-black bg-opacity-50" 
            : "pointer-events-none"
        )}>
          <div className={cn(
            "fixed inset-y-0 left-0 w-80 sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            {/* DRAWER HEADER */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isLoggedIn && user?.profile?.firstName && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 font-semibold text-sm">
                      {user.profile.firstName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">
                    {isLoggedIn 
                      ? `Hello, ${user?.profile?.firstName || "User"}`
                      : "Welcome"
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {isLoggedIn ? user?.email : "Sign in for better experience"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeAllMenus}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div className="h-[calc(100vh-80px)] overflow-y-auto p-4">
              
              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Link
                  href={isLoggedIn ? "/account" : "/login"}
                  className="p-3 border rounded-lg text-center hover:bg-green-50 transition-colors"
                  onClick={closeAllMenus}
                >
                  <User size={20} className="mx-auto mb-2" />
                  <span className="text-sm font-medium">Account</span>
                </Link>
                <Link
                  href="/orders"
                  className="p-3 border rounded-lg text-center hover:bg-green-50 transition-colors"
                  onClick={closeAllMenus}
                >
                  <Package size={20} className="mx-auto mb-2" />
                  <span className="text-sm font-medium">Orders</span>
                </Link>
              </div>

              {/* MAIN MENU */}
              <nav className="space-y-1">
                {mainLinks.map((item) => (
                  <div key={item.label}>
                    {item.link ? (
                      <Link
                        href={item.link}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        onClick={() => !item.submenu && closeAllMenus()}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.submenu && <ChevronDown size={16} />}
                      </Link>
                    ) : (
                      // In mobile, show "Links" as a header without click
                      <div className="flex items-center justify-between p-3 rounded-lg group">
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="font-medium text-gray-400">{item.label}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* MOBILE SUBMENU */}
                    {item.submenu && (
                      <div className={cn(
                        "space-y-1",
                        !item.link && "ml-4 pl-4 border-l" // Only indent if it's the "Links" dropdown
                      )}>
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.link}
                            href={subItem.link}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                            onClick={closeAllMenus}
                          >
                            {subItem.icon && subItem.icon}
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* CONTACT INFO */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>1800-123-4567</span>
                  </div>
                  <p className="text-gray-600">
                    Mon-Sat: 9:00 AM - 7:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH MODAL */}
        <div className={cn(
          "fixed inset-0 z-[100] transition-all duration-300",
          searchOpen 
            ? "bg-black bg-opacity-50" 
            : "pointer-events-none"
        )}>
          <div className={cn(
            "fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out",
            searchOpen ? "translate-y-0" : "-translate-y-full"
          )}>
            <div className="max-w-3xl mx-auto h-full flex flex-col">
              {/* SEARCH HEADER */}
              <div className="p-4 border-b flex items-center gap-4">
                <button
                  onClick={closeAllMenus}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close search"
                >
                  <X size={22} />
                </button>
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search for products, categories, or brands..."
                    className="w-full pl-10 pr-4 py-3 border-0 bg-gray-100 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
                >
                  Search
                </button>
              </div>

              {/* QUICK SEARCH SUGGESTIONS */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Protein Powder", "Vitamin D", "Ashwagandha", "Fish Oil", "Multivitamin", "Hair Care"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchInput(term);
                        handleSearch();
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderOne;