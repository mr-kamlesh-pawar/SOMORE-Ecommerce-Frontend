"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { account, databases } from "@/lib/appwrite";

/* ---------------- CONFIG ---------------- */

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

/* ---------------- TYPES ---------------- */

type AuthContextType = {
  user: any | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
};

/* ---------------- CONTEXT ---------------- */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  refreshUser: async () => {},
});

/* ================================================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH USER ---------------- */

  const fetchUser = async () => {
    setLoading(true);

    try {
      // 1️⃣ Get auth user
      const authUser = await account.get();

      // 2️⃣ Try fetching profile
      let profile = null;
      try {
        profile = await databases.getDocument(
          DB_ID,
          USERS_COLLECTION_ID,
          authUser.$id
        );
      } catch {
        profile = null; // profile may not exist yet
      }

      // 3️⃣ Attach profile safely
      setUser({
        ...authUser,
        profile, // ✅ ALWAYS present (object or null)
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    fetchUser();
  }, []);

  /* ---------------- PROVIDER ---------------- */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export const useAuth = () => useContext(AuthContext);
