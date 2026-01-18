"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: string | number;
  title: string;
  url: string;
  image1: string;
  image2?: string;
  badge?: string;
  rating?: number;
  ratingCount?: number;
  price: string;
  compareAtPrice?: string;
}

interface FeaturedCollectionProps {
  title: string;
  products: Product[];
  viewAllUrl: string;
}

export default function FeaturedCollection({
  title,
  products,
  viewAllUrl,
}: FeaturedCollectionProps) {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-[1600px] mx-auto px-4">

        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl md:text-4xl font-semibold text-black mb-12"
        >
          {title}
        </motion.h2>

        {/* PERFECT RESPONSIVE GRID */}
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            xl:grid-cols-4 
            gap-10
          "
        >
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <ProductCard product={p} />
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
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}

///////////////////////////////////////////////////////////////////////////////////////

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.url} className="group">
      <div className="w-full">

        {/* IMAGE BOX */}
        <div className="relative aspect-square bg-white overflow-hidden rounded-lg shadow-sm">
          <Image
            src={product.image1}
            alt={product.title}
            fill
            className="object-contain transition duration-500 group-hover:opacity-0"
          />

          {product.image2 && (
            <Image
              src={product.image2}
              alt=""
              fill
              className="absolute top-0 left-0 object-contain opacity-0 transition duration-500 group-hover:opacity-100"
            />
          )}

          {/* BADGE */}
          {product.badge && (
            <span
              className="
                absolute top-3 left-3 
                bg-green-900 text-white text-xs 
                px-3 py-1 rounded-full
              "
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* TITLE */}
        <h3 className="mt-4 text-[15px] text-black leading-snug text-center">
          {product.title}
        </h3>

        {/* RATING */}
    

{/* RATING */}
<div className="flex justify-center items-center gap-2 text-sm mt-2">
  {/* Show stars based on rating */}
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={
          product.rating && star <= Math.round(product.rating)
            ? 'text-yellow-500'
            : 'text-gray-300'
        }
      >
        ★
      </span>
    ))}
  </div>
  
  {/* Show rating number if it exists */}
  {product.rating ? (
    <>
      <span className="text-black">{product.rating.toFixed(1)}</span>
      {product.ratingCount && product.ratingCount > 0 && (
        <span className="text-gray-500">({product.ratingCount})</span>
      )}
    </>
  ) : product.ratingCount && product.ratingCount > 0 ? (
    // Only show review count if no rating
    <span className="text-gray-500 text-xs">({product.ratingCount})</span>
  ) : (
    // Show nothing or "No reviews" if you prefer
    null
  )}
</div>

        {/* PRICE */}
        <div className="mt-2 flex justify-center items-center gap-3 text-[15px]">
          {product.compareAtPrice && (
            <span className="line-through text-gray-400">{product.compareAtPrice}</span>
          )}
          <span className="font-semibold text-red-600">{product.price}</span>
        </div>
      </div>
    </Link>
  );
}
