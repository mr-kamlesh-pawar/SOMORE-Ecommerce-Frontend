"use client";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import Loader from "@/components/others/Loader";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import { getAppwriteImageUrl } from "@/lib/appwriteImage";
import NewLaunchesSkeleton from "../skeleton/NewLaunchesSkeleton";

export default function HerbalSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchHerbalProducts() {
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        [
          Query.equal("isActive", true),
          Query.equal("istopselling", true),
          Query.orderDesc("$createdAt"),
          Query.limit(8), 
        ]
      );
        console.log("top selling producs ", res);
      setProducts(res.documents);
    } catch (err) {
      console.error(" page fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHerbalProducts();
  }, []);

  if (loading) return <NewLaunchesSkeleton />;

  return (
    <FeaturedCollection
      title="Top Selling Products & Supplements"
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
