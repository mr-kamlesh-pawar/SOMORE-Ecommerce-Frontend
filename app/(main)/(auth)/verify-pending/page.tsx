// app/verify-pending/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, RefreshCw } from "lucide-react";
import { account } from "@/lib/appwrite";
import toast from "react-hot-toast";

export default function VerifyPendingPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
    
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleResend = async () => {
    if (!email || resendDisabled) return;
    
    setLoading(true);
    
    try {
      // 1. Login karo temporarily
      const password = prompt("Please enter your password to resend verification email:");
      
      if (!password) {
        toast.error("Password is required");
        setLoading(false);
        return;
      }
      
      const session = await account.createEmailPasswordSession(email, password);
      
      // 2. Verification email send karo
      await account.createVerification(`${window.location.origin}/verify`);
      
      // 3. Session delete karo
      await account.deleteSession(session.$id);
      
      // 4. Success
      toast.success("✅ Verification email sent again!");
      setResendDisabled(true);
      
    } catch (err: any) {
      console.error("Resend error:", err);
      toast.error(err.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Verify Your Email
          </h1>
          
          <p className="text-gray-600">
            We&apos;ve sent a verification link to
            <br />
            <span className="font-medium text-gray-900">{email || "your email address"}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              📬 <strong>Check your inbox</strong> (and spam folder) for the verification email.
              Click the link in the email to activate your account.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              onClick={handleResend}
              disabled={loading || resendDisabled || !email}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : resendDisabled ? (
                `Resend in ${countdown}s`
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </button>
          </div>

          <div className="pt-6 border-t">
            <div className="text-center space-y-3">
              <p className="text-gray-600">
                Already verified?{" "}
                <Link 
                  href="/login" 
                  className="text-green-600 font-medium hover:text-green-700 hover:underline"
                >
                  Login here
                </Link>
              </p>
              
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email? Make sure you entered the correct email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}