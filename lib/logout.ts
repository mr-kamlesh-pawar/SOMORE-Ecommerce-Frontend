import { account } from "@/lib/appwrite";

export async function logout() {
  try {
    await account.deleteSession("current");
    console.log("✅ Logged out successfully");
  } catch (err) {
    console.log("❌ Logout error:", err);
  }
}
