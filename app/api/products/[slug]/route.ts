import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";

export const dynamic = "force-dynamic";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const res = await databases.listDocuments(
    DB_ID,
    COLLECTION_ID,
    [
      Query.equal("slug", slug),
      Query.equal("isActive", true),
      Query.limit(1),
    ]
  );

  //console.log("🟢 RAW APPWRITE RESPONSE:", res.documents);

  if (!res.documents.length) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(res.documents[0], {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
