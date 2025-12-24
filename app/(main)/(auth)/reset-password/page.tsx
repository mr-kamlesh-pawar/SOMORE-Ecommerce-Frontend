// app/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(true);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [linkInfo, setLinkInfo] = useState({
    userId: "",
    secret: "",
    expires: "",
  });

  // Check link validity
  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");
    const expire = searchParams.get("expire");

    console.log("🔍 Reset password params:", { userId, secret, expire });

    if (!userId || !secret) {
      setValidLink(false);
      toast.error("Invalid reset link");
      return;
    }

    setLinkInfo({
      userId,
      secret,
      expires: expire || "",
    });

    // Check if link is expired
    if (expire) {
      const expireDate = new Date(decodeURIComponent(expire));
      const now = new Date();
      
      if (now > expireDate) {
        setValidLink(false);
        toast.error("Reset link has expired");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!linkInfo.userId || !linkInfo.secret) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Resetting password...");
      
      // Update recovery (reset password)
      await account.updateRecovery(
        linkInfo.userId,
        linkInfo.secret,
        formData.password,
       // formData.password // Confirm password
      );

      console.log("✅ Password reset successful");
      
      setPasswordReset(true);
      toast.success("✅ Password reset successfully!");
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      console.error("❌ Password reset error:", err);
      
      if (err.code === 401) {
        toast.error("Reset link expired or invalid");
        setValidLink(false);
      } else if (err.code === 400) {
        toast.error("Invalid password format");
      } else if (err.code === 404) {
        toast.error("User not found");
      } else {
        toast.error(err.message || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!validLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-red-700 mb-3">Invalid Reset Link</h2>
          <p className="text-gray-700 mb-6">
            This password reset link is invalid or has expired.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
            >
              Request New Reset Link
            </Link>
            <Link
              href="/login"
              className="block border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-green-700 mb-3">Password Reset Successful!</h2>
          <p className="text-gray-700 mb-6">
            Your password has been updated successfully. You can now login with your new password.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              ✅ Password updated successfully
              <br />
              🔄 Redirecting to login page...
            </p>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/login"
              className="block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
            >
              Go to Login Page
            </Link>
            <p className="text-sm text-gray-500">
              Redirecting automatically in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
          <p className="text-gray-600 mt-2">Create a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter new password"
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                <span className="mr-2">•</span>
                At least 8 characters
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Use letters and numbers
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Avoid common passwords
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.password || !formData.confirmPassword}
            className={`w-full py-3.5 rounded-lg text-white font-medium transition ${
              loading || !formData.password || !formData.confirmPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>

        {/* Debug Info (visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <details className="text-sm">
              <summary className="text-gray-500 cursor-pointer">Debug Info</summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs">
                <p><strong>User ID:</strong> {linkInfo.userId?.substring(0, 10)}...</p>
                <p><strong>Link Valid:</strong> {validLink ? 'Yes' : 'No'}</p>
                <p><strong>Expires:</strong> {linkInfo.expires || 'N/A'}</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}