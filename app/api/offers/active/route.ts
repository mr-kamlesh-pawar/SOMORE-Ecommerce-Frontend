// app/api/offers/active/route.ts
import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

// ✅ NO CACHE
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const OFFERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_OFFERS_COLLECTION_ID!;

export async function GET() {
  try {
    const res = await databases.listDocuments(
      DB_ID,
      OFFERS_COLLECTION_ID,
      [
        Query.equal("isActive", true),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
      ]
    );

    console.log(`🔄 API: Fresh offer data`);

    return NextResponse.json(res.documents[0] || null, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer" },
      { status: 500 }
    );
  }
}