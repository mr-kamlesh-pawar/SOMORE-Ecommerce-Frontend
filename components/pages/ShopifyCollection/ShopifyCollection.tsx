"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: string | number;
  title: string;
  url: string;
  image1: string;
  badge?: string;
  rating?: number;
  ratingCount?: number;
  price: string;
  compareAtPrice?: string;
}

interface Props {
  title: string;
  products: Product[];
  viewAllUrl: string;
}

export default function ShopifyCollection({ title, products, viewAllUrl }: Props) {
  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-[1600px] mx-auto px-4">

        {/* SECTION TITLE */}
        <h2 className="text-center text-[32px] md:text-[40px] font-semibold mb-12 text-[#121212]">
          {title}
        </h2>

        {/* GRID LIKE SHOPIFY */}
        <div
          className="
            grid gap-x-6 gap-y-10
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
          "
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="flex justify-center mt-12">
          <Link
            href={viewAllUrl}
            className="
              bg-black text-white px-10 py-3 
              rounded-md text-sm font-medium 
              hover:bg-gray-900 transition
            "
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.url} className="block group">
      <div className="w-full bg-white overflow-hidden rounded-lg">

        {/* IMAGE WRAPPER (Shopify exact ratio) */}
        <div className="relative aspect-square bg-white overflow-hidden border rounded-lg">
          <Image
            src={product.image1}
            alt={product.title}
            fill
            className="
              object-contain transition-transform duration-500
              group-hover:scale-105
            "
          />

          {product.badge && (
            <span className="
              absolute top-3 left-3 
              bg-[#0A5C2E] text-white text-[12px] 
              px-3 py-[3px] rounded-md
            ">
              {product.badge}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="text-center mt-4">

          {/* TITLE */}
          <p className="text-[15px] font-medium text-[#121212] leading-snug line-clamp-3 px-2">
            {product.title}
          </p>

          {/* RATING */}
          {product.rating && (
            <div className="flex items-center justify-center gap-1 mt-3">
              <span className="text-yellow-500 text-[18px]">★★★★☆</span>
              <span className="text-[#121212] text-[14px]">{product.rating}</span>
              <span className="text-gray-600 text-[14px]">({product.ratingCount})</span>
            </div>
          )}

          {/* PRICE */}
          <div className="mt-3 flex items-center justify-center gap-2 text-[15px]">
            {product.compareAtPrice && (
              <span className="line-through text-gray-400">{product.compareAtPrice}</span>
            )}
            <span className="font-semibold text-[#C00]">{product.price}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}
