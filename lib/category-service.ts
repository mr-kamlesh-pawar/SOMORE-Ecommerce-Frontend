// lib/category-service.ts
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

export type Category = {
  $id: string;
  name: string;
  image?: string;
  $createdAt: string;
  $updatedAt: string;
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CATEGORIES_ID!,
      [Query.limit(10)]
    );
    // ✅ Safe cast since we know the structure matches our Category type
   // console.log(response);
    return response.documents as unknown as Category[];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};