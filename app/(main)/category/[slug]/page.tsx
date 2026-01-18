// app/category/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProductsByCategorySlug, ProductForCategory } from "@/lib/product-service";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getAppwriteImageUrl } from "@/lib/appwriteImage";

const CategoryPage = () => {
  const params = useParams();
  const categorySlug = params.slug as string;

  const [products, setProducts] = useState<ProductForCategory[]>([]);
  const [loading, setLoading] = useState(true); // Start as true for initial load
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [categoryTitle, setCategoryTitle] = useState("");

  const observerTarget = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const formatCategoryTitle = (slug: string) => {
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const { items, total } = await fetchProductsByCategorySlug(categorySlug, page, 12);

      setProducts(prev => {
        const newProducts = page === 0 ? items : [...prev, ...items];
        setHasMore(newProducts.length < total);
        return newProducts;
      });

      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Failed to load products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, page, hasMore, loading]);

  // Reset and load when slug changes
  useEffect(() => {
    if (!categorySlug) return;

    setProducts([]);
    setPage(0);
    setHasMore(true);
    setLoading(true);
    setCategoryTitle(formatCategoryTitle(categorySlug));
    
    // Reset initial mount flag
    isInitialMount.current = true;
  }, [categorySlug]);

  // Initial load effect
  useEffect(() => {
    if (!categorySlug || !isInitialMount.current) return;

    const loadInitialProducts = async () => {
      setLoading(true);
      try {
        const { items, total } = await fetchProductsByCategorySlug(categorySlug, 0, 12);
        
        setProducts(items);
        setHasMore(items.length < total);
        setPage(1); // Next page will be 1
      } catch (error) {
        console.error("Failed to load products:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        isInitialMount.current = false;
      }
    };

    loadInitialProducts();
  }, [categorySlug]);

  // Infinite scroll setup
  useEffect(() => {
    if (!hasMore || loading || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreProducts();
        }
      },
      { 
        threshold: 0.5,
        rootMargin: "100px" // Trigger slightly before reaching the bottom
      }
    );

    const currentTarget = observerTarget.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreProducts, hasMore, loading]);

  // Product Card Component
  const ProductCard = ({ product }: { product: ProductForCategory }) => {
    const firstImageUrl = getAppwriteImageUrl(product.images[0], product.$updatedAt);
    const secondImageUrl = product.images[1] 
      ? getAppwriteImageUrl(product.images[1], product.$updatedAt) 
      : null;

    return (
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="w-full">
          <div className="relative aspect-square bg-white overflow-hidden rounded-lg shadow-sm border">
            <Image
              src={firstImageUrl}
              alt={product.name}
              fill
              className="object-contain transition duration-500 group-hover:opacity-0"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder.png";
              }}
            />
            {secondImageUrl && (
              <Image
                src={secondImageUrl}
                alt=""
                fill
                className="absolute top-0 left-0 object-contain opacity-0 transition duration-500 group-hover:opacity-100"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}
            {product.badge && (
              <span className="absolute top-3 left-3 bg-green-900 text-white text-xs px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
          <h3 className="mt-4 text-[15px] text-black leading-snug text-center line-clamp-2">
            {product.name}
          </h3>
       {(product.averagerating && product.averagerating > 0) ? (
  <div className="flex justify-center items-center gap-2 text-sm mt-2">
    {/* Show star rating based on average rating */}
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${
            star <= Math.round(product.averagerating!)
              ? 'text-yellow-500'
              : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
    <span className="text-black">{product.averagerating.toFixed(1)}</span>
    {product.reviewcount && product.reviewcount > 0 && (
      <span className="text-gray-500">({product.reviewcount})</span>
    )}
  </div>
) : product.reviewcount && product.reviewcount > 0 ? (
  // Only review count exists but no average rating
  <div className="flex justify-center items-center gap-2 text-sm mt-2">
    <div className="flex text-gray-300">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>★</span>
      ))}
    </div>
    <span className="text-gray-400">No rating</span>
    <span className="text-gray-500">({product.reviewcount})</span>
  </div>
) : (
  // No reviews at all - show "No reviews yet" or nothing
  <div className="flex justify-center items-center gap-2 text-sm mt-2">
    <div className="flex text-gray-300">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>★</span>
      ))}
    </div>
    <span className="text-gray-400 text-xs">No reviews yet</span>
  </div>
)}
          <div className="mt-2 flex justify-center items-center gap-3 text-[15px]">
            {product.marketprice > product.price && (
              <span className="line-through text-gray-400">
                ₹{product.marketprice.toFixed(2)}
              </span>
            )}
            <span className="font-semibold text-red-600">₹{product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-8 border-b">
        <div className="max-w-[1600px] mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-3xl md:text-4xl font-bold text-gray-900"
          >
            {categoryTitle || formatCategoryTitle(categorySlug)}
          </motion.h1>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="max-w-[1600px] mx-auto px-4">
          {/* Initial Loading State */}
          {loading && products.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="mt-4 h-4 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCT GRID */}
          {products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
              {products.map((product, i) => (
                <motion.div
                  key={product.$id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-lg">
              No products found in this category.
            </div>
          )}

          {/* LOADING / PAGINATION INDICATOR */}
          <div ref={observerTarget} className="mt-8 flex justify-center min-h-[60px]">
            {/* Loading more indicator */}
            {loading && products.length > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                Loading more products...
              </div>
            )}

            {/* End of results message */}
            {!loading && !hasMore && products.length > 0 && (
              <div className="text-gray-500 text-sm py-4">
                That's all for now!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;