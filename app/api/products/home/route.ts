import { NextResponse } from "next/server";
import { databases, storage } from "@/lib/appwrite"; // Import storage
import { Query, Storage } from "appwrite";

export const dynamic = "force-dynamic";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const PRODUCTS_COLLECTION_ID = 
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!; // Add bucket ID to env

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
        Query.equal("isActive", true),
        Query.equal("homeSection", section),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );

    console.log("🔥 API FETCH", section, res.documents.length);

    // Transform documents to include full image URLs
    const productsWithImageUrls = await Promise.all(
      res.documents.map(async (product) => {
        if (product.images && Array.isArray(product.images)) {
          // Create full URLs for each image ID
          const imageUrls = product.images.map(fileId => 
            storage.getFileView(BUCKET_ID, fileId)
          );
          return {
            ...product,
            images: imageUrls // Replace IDs with full URLs
          };
        }
        return product;
      })
    );

    return NextResponse.json(productsWithImageUrls, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
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