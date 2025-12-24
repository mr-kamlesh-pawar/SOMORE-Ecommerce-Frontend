import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";

export const dynamic = "force-dynamic";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const OFFERS_COLLECTION = "offers"; // 👈 your offers table name

export async function GET() {
  const res = await databases.listDocuments(
    DB_ID,
    OFFERS_COLLECTION,
    [
      Query.equal("isactive", true),
      Query.orderDesc("$createdAt"),
      Query.limit(1), // 👈 ONE COMMON OFFER
    ]
  );

  return NextResponse.json(res.documents[0] ?? null, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
