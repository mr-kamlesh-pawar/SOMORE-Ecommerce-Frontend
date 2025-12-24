"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { account } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/AuthContext";

export default function LoginPage() {
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

useEffect(() => {
  console.log("🔍 Auth check started...");

  account
    .get()
    .then((user) => {
      console.log("✅ User already logged in:", user);
      console.log("➡️ Redirecting to /");
      router.replace("/");
    })
    .catch((err) => {
      console.log("❌ User NOT logged in");
      console.log("Error:", err?.message || err);
    });
}, []);



  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      await account.createEmailPasswordSession(email, password);
      await refreshUser(); // 🔥 sync auth context
      toast.success("Login successful 🎉");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }

    setLoading(false);
  };

 


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-semibold text-center">Welcome Back 👋</h2>

        <form onSubmit={handleLogin} className="space-y-6 mt-6">
          <div>
            <label className="text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                required
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full border rounded-lg pl-10 pr-12 py-3"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg text-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="underline text-black">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}
