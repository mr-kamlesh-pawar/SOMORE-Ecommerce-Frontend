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
  Package,
  Info,
  Mail,
  Briefcase, 
  Heart,
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
import { fetchCategories } from "@/lib/category-service";

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

  const [categories, setCategories] = useState<{ label: string; link: string; icon: React.ReactNode }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    if (!mounted) return;

    const loadCategories = async () => {
      setLoadingCategories(true);
      const fetched = await fetchCategories();
     // console.log(fetched)
      const mapped = fetched.map(cat => ({
        label: cat.name,
        link: `/category/${cat.name}`,
        icon: <Pill size={14} />
      }));
      setCategories(mapped);
      setLoadingCategories(false);
    };

    loadCategories();
  }, [mounted]);

  /* ---------------- SEARCH HANDLER ---------------- */
    const handleSearchClick = () => {
    router.push("/search");
  };

  /* ---------------- STATIC NAV LINKS (excluding Categories) ---------------- */
  const staticMainLinks = [
    { label: "Shop", link: "/products", icon: <Package size={16} /> },
    { label: "Bulk Order", link: "/bulk-order", icon: null },
    { 
      label: "Links", 
      link: null,
      icon: <Info size={16} />,
      submenu: [
        { label: "About Us", link: "/about", icon: <Info size={14} /> },
        { label: "Contact", link: "/contact", icon: <Mail size={14} /> },
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
        { label: "Orders", link: "/orders" },
        { label: "Addresses", link: "/account" },
        { label: "Logout", link: "/account" }
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
      {/* MAIN HEADER */}
      <header className={cn(
        "sticky top-0 z-50 bg-white border-b shadow-sm transition-all duration-300",
        scrolled && "shadow-lg"
      )}>
        <AnnouncementBar />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
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
              {/* Shop */}
              <div className="relative group">
                <Link
                  href="/products"
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200",
                    pathname.startsWith("/products") && "text-green-800 bg-green-50"
                  )}
                >
                  <Package size={16} className="mr-1" />
                  Shop
                </Link>
              </div>

              {/* Categories Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown("Categories")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-green-800 hover:bg-green-50 transition-all duration-200 cursor-pointer",
                    activeDropdown === "Categories" && "text-green-800 bg-green-50"
                  )}
                  onClick={() => toggleDropdown("Categories")}
                >
                 
                  Categories
                  <ChevronDown size={16} className="ml-1" />
                </button>

                {(activeDropdown === "Categories" || loadingCategories) && (
                  <div className="absolute top-full left-0 w-56 mt-1 bg-white border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {loadingCategories ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                    ) : categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat.link}
                          href={cat.link}
                          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                          onClick={closeAllMenus}
                        >
                          {cat.icon}
                          {cat.label}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No categories</div>
                    )}
                  </div>
                )}
              </div>

              {/* Remaining Static Links (Bulk Order + Links) */}
              {staticMainLinks.slice(1).map((item) => (
                <div 
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => item.submenu && setActiveDropdown(null)}
                >
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
            <div className="flex items-center gap-1 lg:gap-2">
              <button
                onClick={handleSearchClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

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

            <div className="h-[calc(100vh-80px)] overflow-y-auto p-4">
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

              {/* MAIN MENU - Mobile */}
              <nav className="space-y-1">
                {/* Shop */}
                <Link href="/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeAllMenus}>
                  <Package size={16} />
                  <span className="font-medium">Shop</span>
                </Link>

                {/* Categories */}
                <div>
                  <div className="flex items-center gap-3 p-3 text-gray-500">
                    <Pill size={16} />
                    <span className="font-medium">Categories</span>
                  </div>
                  <div className="ml-4 pl-4 border-l space-y-1">
                    {loadingCategories ? (
                      <div className="text-sm text-gray-500 px-2 py-1">Loading...</div>
                    ) : categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat.link}
                          href={cat.link}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                          onClick={closeAllMenus}
                        >
                          {cat.icon}
                          <span>{cat.label}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 px-2 py-1">No categories</div>
                    )}
                  </div>
                </div>

                {/* Bulk Order */}
                <Link href="/bulk-order" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={closeAllMenus}>
                  <Briefcase size={16} />
                  <span className="font-medium">Bulk Order</span>
                </Link>

                {/* Links Section */}
                <div>
                  <div className="flex items-center gap-3 p-3 text-gray-400">
                    <Info size={16} />
                    <span className="font-medium">Links</span>
                  </div>
                  <div className="ml-4 pl-4 border-l space-y-1">
                    <Link href="/about" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" onClick={closeAllMenus}>
                      <Info size={14} />
                      <span>About Us</span>
                    </Link>
                    <Link href="/contact" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors" onClick={closeAllMenus}>
                      <Mail size={14} />
                      <span>Contact</span>
                    </Link>
                  </div>
                </div>
              </nav>

              <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <span>1800-123-4567</span>
                  </div>
                  <p className="text-gray-600">Mon-Sat: 9:00 AM - 7:00 PM</p>
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