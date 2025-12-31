"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface IncomingProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  isHome: boolean;
  images: string[];
}

interface ProductCard {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  badge?: string;
  image: string;
  link: string;
  isHome: boolean;
}

interface Props {
  title?: string;
  products: IncomingProduct[];
  viewAllLink?: string;
}

export default function NewLaunches({
  title = "NEW LAUNCHES",
  products,
  viewAllLink = "#",
}: Props) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Convert incoming data → component-friendly format
  const mappedProducts: ProductCard[] = products.map((item) => ({
    id: item.id,
    title: item.title,
    price: `₹${item.price}`,
    compareAtPrice: item.compareAtPrice ? `₹${item.compareAtPrice}` : undefined,
    badge: item.badge,
    image: item.images?.[0] || "/images/placeholder.png",
    link: `/products/${item.slug}`,
    isHome: item.isHome,
  }));

  const homeProducts = mappedProducts.filter((p) => p.isHome);

 const handleImageError = (id: string) => {
  setImageErrors(prev => {
    const newSet = new Set(prev);
    newSet.add(id);
    return newSet;
  });
};

  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="max-w-[1600px] mx-auto px-3 md:px-6">
        {/* TITLE */}
        <h2 className="text-center text-2xl md:text-4xl font-bold text-black tracking-wide mb-6 md:mb-10">
          {title}
        </h2>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4">
          {homeProducts.map((item, index) => (
            <Link 
              key={item.id} 
              href={item.link} 
              className="group text-center"
              aria-label={`View ${item.title}`}
            >
              {/* IMAGE CONTAINER */}
              <div className="relative w-full mx-auto aspect-square overflow-hidden rounded-lg">
                {imageErrors.has(item.id) ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">Image not available</span>
                  </div>
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onError={() => handleImageError(item.id)}
                    priority={index < 2}
                    unoptimized={item.image.includes('appwrite.io')}
                  />
                )}

                {/* BADGE - Only show on 4th item */}
                {index === 3 && item.badge && (
                  <span className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded-full z-10">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* TITLE */}
              <h3 className="mt-4 text-sm md:text-base font-medium text-black leading-tight px-2 line-clamp-2">
                {item.title}
              </h3>

              {/* PRICES */}
              <div className="mt-2">
                {item.compareAtPrice ? (
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-sm line-through text-gray-400">
                      {item.compareAtPrice}
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      {item.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-black">
                    {item.price}
                  </span>
                )}
              </div>

            </Link>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="flex justify-center mt-10">
          <Link
            href={viewAllLink}
            className="bg-black text-white px-10 py-3 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors duration-300"
            aria-label="View all new launch products"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}