"use client";
import { useEffect, useState } from "react";
import { databases, storage } from "@/lib/appwrite";
import { Query } from "appwrite";
import NewLaunches from "@/components/newLaunches/NewLaunches";
import Loader from "@/components/others/Loader";
import { getAppwriteImageUrl } from "@/lib/appwriteImage";
import NewLaunchesSkeleton from "../skeleton/NewLaunchesSkeleton";

export default function NewLaunchesSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
      [
        Query.equal("isActive", true),
        Query.equal("homeSection", "new-launches"),
        Query.orderDesc("$createdAt"),
        Query.limit(4),
      ]
    );

    setProducts(res.documents);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <NewLaunchesSkeleton />;




  return (
    <NewLaunches
      products={products.map(p => ({
        id: p.$id,
        slug: p.slug,
        title: p.name,
        price: p.price,
        badge: p.badge,
         compareAtPrice: p.marketprice,
       images: p.images && Array.isArray(p.images)
  ? p.images.map((id: string) =>
      getAppwriteImageUrl(id, p.$updatedAt)
    )
  : ["/images/placeholder.png"],

        isHome: true,
      }))}
      viewAllLink="/products?category=New"
    />
  );
}
