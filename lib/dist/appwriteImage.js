"use strict";
exports.__esModule = true;
exports.getAppwriteImageUrl = void 0;
var appwrite_1 = require("@/lib/appwrite");
/**
 * Converts Appwrite fileId to a safe image URL for next/image
 */
function getAppwriteImageUrl(fileId, updatedAt) {
    // ❌ No file id
    if (!fileId)
        return "/images/placeholder.png";
    // ❌ Already a valid URL
    if (fileId.startsWith("http") || fileId.startsWith("/")) {
        return fileId;
    }
    try {
        return (appwrite_1.storage.getFileView(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, fileId) + ("&v=" + (updatedAt || "")));
    }
    catch (e) {
        console.error("Image URL error:", e);
        return "/images/placeholder.png";
    }
}
exports.getAppwriteImageUrl = getAppwriteImageUrl;
