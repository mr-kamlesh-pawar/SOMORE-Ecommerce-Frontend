import { storage } from "@/lib/appwrite";

/**
 * Converts Appwrite fileId to a safe image URL for next/image
 */
export function getAppwriteImageUrl(
  fileId?: string,
  updatedAt?: string
): string {
  // ❌ No file id
  if (!fileId) return "/images/placeholder.png";

  // ❌ Already a valid URL
  if (fileId.startsWith("http") || fileId.startsWith("/")) {
    return fileId;
  }

  try {
    return (
      storage.getFileView(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
        fileId
      ) + `&v=${updatedAt || ""}`
    );
  } catch (e) {
    console.error("Image URL error:", e);
    return "/images/placeholder.png";
  }
}
