import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { databases, storage } from "@/lib/appwrite"; // Import storage

export const dynamic = "force-dynamic";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!; // Add bucket ID

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
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
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