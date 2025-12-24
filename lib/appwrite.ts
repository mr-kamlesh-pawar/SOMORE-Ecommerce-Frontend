// lib/appwrite.ts
import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // ✅ FIX

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { client};
