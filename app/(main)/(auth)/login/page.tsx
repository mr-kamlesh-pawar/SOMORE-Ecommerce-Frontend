"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { account, databases } from "@/lib/appwrite";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/context/AuthContext";

export default function LoginPage() {
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Auto-fill email from query params
  useEffect(() => {
    const email = searchParams.get("email");
    const verified = searchParams.get("verified");
    
    if (email) {
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = decodeURIComponent(email);
      }
      
      if (verified === "true") {
        toast.success("Email verified! Please login with your password.");
      }
    }
  }, [searchParams]);

  // ✅ Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        console.log("✅ Already logged in as:", user.email);
        router.replace("/");
      } catch (err) {
        console.log("ℹ️ No active session");
        // Not logged in, continue
      }
    };

    checkAuth();
  }, [router]);

  // ✅ Login handler with proper verification check
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value.trim();

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Attempting login for:", email);
      
      // Step 1: Create session
      const session = await account.createEmailPasswordSession(email, password);
      console.log("✅ Session created:", session.$id);
      
      // Step 2: Get user details
      const user = await account.get();
      console.log("✅ User fetched:", user.email, "Verified:", user.emailVerification);
      
      // Step 3: Check Appwrite email verification
      if (!user.emailVerification) {
        console.log("⚠️ User not verified in Appwrite");
        
        // Check database status
        try {
          const userDoc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
            user.$id
          );
          
          console.log("📊 Database status:", {
            emailVerified: userDoc.emailVerified,
            accountStatus: userDoc.accountStatus
          });
          
          // Case 1: Database says verified, but Appwrite doesn't
          if (userDoc.emailVerified) {
            console.log("ℹ️ Database shows verified, but Appwrite doesn't");
            
            // Send new verification email
            try {
              await account.createVerification(`${window.location.origin}/verify`);
              toast.error("Verification mismatch. New verification email sent.");
            } catch (verifyErr) {
              console.error("Could not send verification:", verifyErr);
            }
            
            // Still don't allow login - force verification
            await account.deleteSession('current');
            toast.error("Please verify your email using the new link sent.");
            router.push(`/verify-pending?email=${encodeURIComponent(email)}`);
            return;
          }
          
          // Case 2: Neither database nor Appwrite shows verified
          await account.deleteSession('current');
          toast.error("Please verify your email before logging in.");
          router.push(`/verify-pending?email=${encodeURIComponent(email)}`);
          return;
          
        } catch (dbErr) {
          console.error("Database error:", dbErr);
          // Database error, but Appwrite says not verified
          await account.deleteSession('current');
          toast.error("Please verify your email before logging in.");
          router.push(`/verify-pending?email=${encodeURIComponent(email)}`);
          return;
        }
      }
      
      // Step 4: User is verified - update database
      console.log("✅ User verified, updating database...");
      try {
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
          user.$id,
          {
            lastLogin: new Date().toISOString(),
            emailVerified: true, // Ensure it's true
            accountStatus: "active", // Update account status
          }
        );
        console.log("✅ Database updated");
      } catch (updateErr) {
        console.warn("Could not update database:", updateErr);
        // Continue even if database update fails
      }
      
      // Step 5: Success - refresh auth context and redirect
      await refreshUser();
      toast.success("🎉 Login successful!");
      router.push("/");
      
    } catch (err: any) {
      console.error("❌ Login error:", {
        code: err.code,
        message: err.message,
        type: err.type
      });
      
      // Specific error messages
      if (err.code === 401) {
        if (err.message.includes("Invalid credentials")) {
          toast.error("❌ Invalid email or password");
        } else {
          toast.error("Authentication failed. Please try again.");
        }
      } else if (err.code === 429) {
        toast.error("Too many attempts. Please try again later.");
      } else if (err.code === 400) {
        toast.error("Invalid request. Please check your input.");
      } else if (err.message.includes("User not found")) {
        toast.error("Account not found. Please register first.");
      } else {
        toast.error(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Forgot password handler
  const handleForgotPassword = () => {
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value;
    if (email) {
      router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/forgot-password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-2">Welcome Back 👋</h2>
        <p className="text-center text-gray-600 mb-8">Login to your account</p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-green-700 hover:text-green-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">New to our platform?</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <Link
            href="/register"
            className="inline-block w-full border border-green-700 text-green-700 hover:bg-green-50 font-medium py-3 px-4 rounded-lg transition"
          >
            Create New Account
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Having trouble logging in?{" "}
            <button
              onClick={() => router.push("/contact")}
              className="text-green-700 hover:text-green-800 hover:underline"
            >
              Contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}