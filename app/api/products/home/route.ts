import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

export const dynamic = "force-dynamic";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const PRODUCTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

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

  return NextResponse.json(res.documents, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
