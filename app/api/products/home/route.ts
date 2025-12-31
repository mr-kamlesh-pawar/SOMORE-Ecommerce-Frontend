// app/api/products/home/route.ts
import { NextResponse } from "next/server";
import { databases, storage } from "@/lib/appwrite";
import { Query } from "appwrite";

// ✅ NO CACHE - Always fresh
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const limit = Number(searchParams.get("limit") || 4);

  if (!section) {
    return NextResponse.json(
      { error: "section is required" },
      { status: 400 }
    );
  }

  try {
   const res = await databases.listDocuments(
  DB_ID,
  PRODUCTS_COLLECTION_ID,
  [
    Query.select([
      '$id', 'name', 'price', 'marketprice', 'slug', 
      'images', 'badge', 'averagerating', 'reviewcount',
      'homeSection', 'isActive'
    ]),
    Query.equal("isActive", true),
    Query.equal("homeSection", section),
    Query.orderDesc("$createdAt"),
    Query.limit(limit),
  ]
);

    console.log(`🔄 API: Fresh ${section} products - ${res.documents.length}`);

    // Transform documents to include full image URLs
    const productsWithImageUrls = res.documents.map((product) => {
      if (product.images && Array.isArray(product.images)) {
        const imageUrls = product.images.map(fileId => 
          storage.getFileView(BUCKET_ID, fileId)
        );
        return {
          ...product,
          images: imageUrls
        };
      }
      return product;
    });

    return NextResponse.json(productsWithImageUrls, {
      headers: {
        // ✅ NO CACHE headers
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'CDN-Cache-Control': 'no-cache',
        'Vercel-CDN-Cache-Control': 'no-cache'
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}