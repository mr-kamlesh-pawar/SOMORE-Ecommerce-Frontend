// app/api/products/[slug]/route.ts
import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { databases, storage } from "@/lib/appwrite";

// ✅ ISR for product pages
export const revalidate = 30;

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const res = await databases.listDocuments(
      DB_ID,
      COLLECTION_ID,
      [
        Query.equal("slug", slug),
        Query.equal("isActive", true),
        Query.limit(1),
      ]
    );

    if (!res.documents.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = res.documents[0];
    
    // Convert image IDs to URLs
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map(fileId => 
        storage.getFileView(BUCKET_ID, fileId)
      );
    }

    return NextResponse.json(product, {
      headers: {
        // ✅ ISR caching
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
        'CDN-Cache-Control': 'public, s-maxage=30'
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}