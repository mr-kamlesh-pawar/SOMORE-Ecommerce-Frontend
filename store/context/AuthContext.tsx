"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { account } from "@/lib/appwrite";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Fetch logged-in user ONCE
  const fetchUser = async () => {
    try {
      const res = await account.get();
      setUser(res);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        refreshUser: fetchUser, // 🔥 call after login/logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
    