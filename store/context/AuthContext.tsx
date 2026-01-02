"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { account, databases } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

/* ---------------- CONFIG ---------------- */

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;


/* ---------------- TYPES ---------------- */

type AuthContextType = {
  user: any | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
 logout: () => Promise<{ success: boolean; error?: any }>; // Change this
};

/* ---------------- CONTEXT ---------------- */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  refreshUser: async () => {},
  logout: async () => ({ success: false, error: 'Not initialized' }), // Update this
});

/* ================================================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
   const router = useRouter();

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


   /* ---------------- LOGOUT ---------------- */
  const logout = useCallback(async () => {
    try {
      // Delete current session
      await account.deleteSession('current');
      
      // Clear all user data
      setUser(null);
      
      // Clear any stored data
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any app-specific storage
      localStorage.removeItem('selectedAddress');
      localStorage.removeItem('cart-data');
      
      // Force a re-render by refreshing user state
      await fetchUser();
      
      // Redirect to home/login
      router.push('/');
      
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if Appwrite fails, clear local state
      setUser(null);
      localStorage.clear();
      return { success: false, error: error.message };
    }
  }, [router, fetchUser]);


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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export const useAuth = () => useContext(AuthContext);
