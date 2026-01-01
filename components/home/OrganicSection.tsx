"use client";
import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import Loader from "@/components/others/Loader";
import ShopifyCollection from "@/components/pages/ShopifyCollection/ShopifyCollection";
import { getAppwriteImageUrl } from "@/lib/appwriteImage";
import NewLaunchesSkeleton from "../skeleton/NewLaunchesSkeleton";

export default function OrganicSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        [
          Query.equal("isActive", true),
          Query.equal("homeSection", "organic-powders"),
          Query.orderDesc("$createdAt"),
          Query.limit(4),
        ]
      );

      setProducts(res.documents);
    } catch (err) {
      console.error("Organic fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <NewLaunchesSkeleton />;

  return (
    <ShopifyCollection
      title="Organic Powders"
      products={products.map((p) => ({
        id: p.$id,
        title: p.name,
        url: `/products/${p.slug}`,
         image1: getAppwriteImageUrl(p.images?.[0], p.$updatedAt),
        badge: p.badge,
        rating: p.averagerating,
        ratingCount: p.reviewcount,
        price: `₹${p.price}`,
        compareAtPrice: p.marketprice
          ? `₹${p.marketprice}`
          : undefined,
      }))}
      viewAllUrl="/collections/organic-powders"
    />
  );
}
