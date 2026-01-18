"use client";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import { getAppwriteImageUrl } from "@/lib/appwriteImage";
import NewLaunchesSkeleton from "@/components/skeleton/NewLaunchesSkeleton";

export default function RecommandedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRecommendedProducts() {
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        [
          Query.equal("isActive", true),
          Query.equal("homeSection", "herbal"), // Changed from "herbal" to "recommended"
          Query.orderDesc("$createdAt"),
          Query.limit(8),
        ]
      );

      setProducts(res.documents);
    } catch (err) {
      console.error("Recommended products fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  if (loading) return <NewLaunchesSkeleton />;

  return (
    <FeaturedCollection
      title="Recommended Products"
      products={products.map((p) => ({
        id: p.$id,
        title: p.name,
        url: `/products/${p.slug}`,
        image1: getAppwriteImageUrl(p.images?.[0], p.$updatedAt),
        image2: getAppwriteImageUrl(p.images?.[1], p.$updatedAt),
        badge: p.badge,
        rating: p.averagerating,
        ratingCount: p.reviewcount,
        price: `₹${p.price}`,
        compareAtPrice: p.marketprice
          ? `₹${p.marketprice}`
          : undefined,
      }))}
      viewAllUrl="/products?category=Top"
    />
  );
}