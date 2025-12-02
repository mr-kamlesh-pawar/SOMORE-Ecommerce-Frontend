"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface IncomingProduct {
  id: number | string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  images: string[];
  category: string;
}

interface ProductCard {
  id: number | string;
  title: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  image: string;
  link: string;
  category: string
}

interface Props {
  title?: string;
  category?: string;
  products: IncomingProduct[];
}

export default function ShopPageOne({
  title,
  products,
  category
}: Props) {
  const mappedProducts: ProductCard[] = products.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    compareAtPrice: item.compareAtPrice,
    badge: item.badge,
    category : item.category,
    image: item.images?.[0] || "",
    link: `/products/${item.slug}`,
  }));

  const [filterDrawer, setFilterDrawer] = useState(false);
  const [sort, setSort] = useState("none");
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  // ------------------ FILTER LOGIC ------------------
  let displayedProducts = [...mappedProducts];

  if (category) {
  displayedProducts = displayedProducts.filter((item) => item.category === category);
}


  if (showSaleOnly) {
    displayedProducts = displayedProducts.filter((p) => p.badge === "Sale");
  }

  if (sort === "low-high") {
    displayedProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high-low") {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  // ------------------ PAGINATION ------------------
  const totalPages = Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const productcount = displayedProducts.length;

  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="max-w-[1600px] mx-auto px-3 md:px-6">

        {/* HEADER */}
        <div className="w-full flex items-center justify-between py-4 relative">

          {/* FILTER BTN */}
          <button
            onClick={() => setFilterDrawer(true)}
            className="flex items-center gap-2 text-sm md:text-base bg-gray-100 px-4 py-2 rounded-lg border md:border-none hover:bg-gray-200 md:hover:bg-transparent md:hover:underline"
          >
            <SlidersHorizontal size={18} />
            Filter
          </button>

          {/* TITLE CENTER */}
          <h2 className="absolute left-1/2 -translate-x-1/2 text-xl md:text-3xl font-bold text-black text-center">
            {title}
          </h2>

          {/* PRODUCT COUNT */}
          <p className="text-sm md:text-base text-gray-600 whitespace-nowrap">
            {productcount} Products
          </p>
        </div>

        {/* ========== PRODUCT GRID ========== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4">
          {paginatedProducts.map((item, index) => (
            <Link key={item.id} href={item.link} className="group text-center">

              {/* IMG */}
              <div className="relative w-full mx-auto aspect-square">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain transition-all duration-500 group-hover:scale-105"
                />

                {item.badge && (
                  <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* TITLE */}
              <h3 className="mt-4 text-sm md:text-base font-medium text-black leading-tight px-2">
                {item.title}
              </h3>

              {/* PRICE */}
              <div className="mt-2">
                {item.compareAtPrice ? (
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-sm line-through text-gray-400">
                      ₹{item.compareAtPrice}
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      ₹{item.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-black">
                    ₹{item.price}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* ================== PAGINATION UI ================== */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-10">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-gray-600 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

        {/* ========== FILTER DRAWER ========== */}
        {filterDrawer && (
          <div className="fixed inset-0 bg-black/40 z-50 flex">

            {/* Drawer Box */}
            <div className="w-72 bg-white h-full p-5 shadow-lg animate-slide-right">

              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Sort */}
              <label className="block mb-2 font-medium">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              >
                <option value="none">Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>

              {/* Sale Only */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  checked={showSaleOnly}
                  onChange={() => setShowSaleOnly(!showSaleOnly)}
                />
                <label>Show only Sale</label>
              </div>

              <button
                onClick={() => {
                  setSort("none");
                  setShowSaleOnly(false);
                }}
                className="w-full bg-gray-200 py-2 rounded mb-3"
              >
                Reset Filters
              </button>

              <button
                onClick={() => setFilterDrawer(false)}
                className="w-full bg-black text-white py-2 rounded"
              >
                Apply
              </button>
            </div>

            {/* Close overlay */}
            <div
              className="flex-1"
              onClick={() => setFilterDrawer(false)}
            ></div>
          </div>
        )}
      </div>
    </section>
  );
}
