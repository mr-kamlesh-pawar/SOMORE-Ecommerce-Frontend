"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, User, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../logo/Logo";
import AnnouncementBar from "./AnnouncementBar";
import { useRouter } from "next/navigation";


const HeaderOne = () => {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

    const handleSearch = () => {
  if (!searchInput.trim()) return; // avoid empty search
  router.push(`/search?query=${searchInput.trim()}`);
  setSearchOpen(false);
};


  const links = [
    { label: "Shop", link: "/shop" },
    { label: "Men's Health", link: "/mens-health" },
    { label: "Women's Health", link: "/womens-health" },
    { label: "Combos", link: "/combos" },
    { label: "Collections", link: "/collections" },
    { label: "About", link: "/about" },
    { label: "Bulk Order", link: "/bulk-order" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b">

      <AnnouncementBar />

      {/* MAIN HEADER */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 relative">

        {/* ---------------- MOBILE/TABLET MENU BUTTON ---------------- */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-md border bg-gray-100 dark:bg-slate-800"
        >
          <Menu size={22} />
        </button>

        {/* ---------------- CENTER LOGO (MOBILE/TABLET) ---------------- */}
        <div className="flex-1 lg:flex-none text-center lg:text-left relative">

          {/* Mobile/Tablet Centered Logo */}
          <div className="lg:hidden absolute left-1/2 -translate-x-1/2 -top-4">
            <Logo />
          </div>

          {/* Desktop Logo (normal position) */}
          <div className="hidden lg:block">
            <Logo />
          </div>
        </div>

  {/* ---------------- DESKTOP NAVIGATION MENU ---------------- */}
      <nav className="hidden lg:flex items-center gap-6 mx-auto max-w-screen-xl py-2">
        {links.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            className={cn(
              "text-lg font-medium px-3 py-1 hover:underline ",
              pathname.startsWith(item.link) &&
                "text-green-800 underline"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

        {/* ---------------- RIGHT ICONS (MOBILE/TABLET + DESKTOP) ---------------- */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Search size={22} />
          </button>

          {/* Desktop Account Button only */}
          <Link
            href="/account"
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 hidden lg:block"
          >
            <User size={22} />
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </Link>
        </div>

      </div>

    

      {/* ---------------- MOBILE DRAWER ---------------- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-900 w-72 h-full p-5 shadow-xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mb-6 p-2 rounded-md border bg-gray-100 dark:bg-slate-800"
            >
              <X size={22} />
            </button>

            <ul className="flex flex-col gap-4">
              {links.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  className="text-lg font-medium border-b pb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}

     {/* ---------------- SEARCH MODAL ---------------- */}
{searchOpen && (
  <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col p-6">

    {/* Close Button */}
    <button
      onClick={() => setSearchOpen(false)}
      className="self-end mb-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      <X size={22} />
    </button>

    {/* Search Box + Button */}
    <div className="max-w-lg mx-auto w-full space-y-4">

      <input
        type="search"
        placeholder="Search for products..."
        className="w-full border rounded-lg px-4 py-3 text-lg outline-none bg-gray-100 dark:bg-slate-800"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <button
        onClick={handleSearch}
        className="w-full bg-[#063E09] text-white py-3 rounded-lg text-lg font-medium hover:bg-[#096e0e]"
      >
        Search
      </button>

    </div>
  </div>
)}

    </header>
  );
};

export default HeaderOne;
