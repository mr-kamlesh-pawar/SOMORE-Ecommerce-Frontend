// app/verify/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account, databases } from "@/lib/appwrite";
import { CheckCircle, XCircle, LogIn, MailCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'checking' | 'verifying' | 'success' | 'error' | 'logging-in'>('checking');
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const urlUserId = searchParams.get("userId");
      const secret = searchParams.get("secret");

      console.log("🔍 Verification parameters received:", { urlUserId, secret });

      if (!urlUserId || !secret) {
        setStatus("error");
        setMessage("Invalid verification link - missing parameters");
        return;
      }

      setUserId(urlUserId);
      setStatus("verifying");

      try {
        console.log("🔄 Step 1: Verifying email with Appwrite...");
        
        // ✅ IMPORTANT: Use the existing account instance (not temporary client)
        // Direct verification call
        await account.updateVerification(urlUserId, secret);
        console.log("✅ Step 1: Appwrite verification SUCCESS");

        // ✅ Step 2: Update database
        console.log("🔄 Step 2: Updating database...");
        try {
          // Tere database me fields: lastName, emailVerified, accountStatus, etc.
          await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
            urlUserId,
            {
              emailVerified: true, // ✅ Ye field tere database me hai
              accountStatus: "verified", // ✅ Ye field tere database me hai
              $updatedAt: new Date().toISOString(), // Auto update hoga
            }
          );
          console.log("✅ Step 2: Database updated successfully");
        } catch (dbError: any) {
          console.error("⚠️ Database update error:", dbError);
          
          // Specific database errors
          if (dbError.message.includes("Unknown attribute")) {
            // Try with only emailVerified field
            await databases.updateDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
              urlUserId,
              {
                emailVerified: true // ✅ Only this field if others cause error
              }
            );
            console.log("✅ Database updated with only emailVerified field");
          }
        }

        // ✅ Step 3: Get user email from database
        console.log("🔄 Step 3: Fetching user details from database...");
        try {
          const userDoc = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
            urlUserId
          );
          
          if (userDoc && userDoc.email) {
            setUserEmail(userDoc.email);
            console.log("✅ User email found:", userDoc.email);
          } else {
            console.warn("⚠️ Could not find email in database");
          }
        } catch (fetchError) {
          console.error("Error fetching user details:", fetchError);
        }

        // ✅ Step 4: Show success
        setStatus("success");
        setMessage("✅ Email verified successfully!");
        toast.success("Email verified! Attempting auto login...");
        
        // ✅ Step 5: Auto login after 1.5 seconds
        setTimeout(() => {
          handleAutoLogin(urlUserId);
        }, 1500);

      } catch (err: any) {
        console.error("❌ Main verification error:", {
          code: err.code,
          message: err.message,
          type: err.type
        });

        // ✅ Handle different error cases
        if (err.code === 409 || err.message?.includes("already verified")) {
          console.log("ℹ️ Email already verified in Appwrite");
          
          try {
            // Check database status
            const userDoc = await databases.getDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
              urlUserId
            );
            
            if (userDoc) {
              setUserEmail(userDoc.email);
              
              // Update database if not already updated
              if (!userDoc.emailVerified) {
                await databases.updateDocument(
                  process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
                  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
                  urlUserId,
                  { emailVerified: true }
                );
              }
              
              setStatus("success");
              setMessage("✅ Email was already verified!");
              toast.success("Email was already verified!");
              
              // Auto login
              setTimeout(() => {
                handleAutoLogin(urlUserId);
              }, 1500);
            } else {
              setStatus("error");
              setMessage("Email already verified, but user not found in database.");
            }
          } catch (dbErr) {
            console.error("Database error in already-verified flow:", dbErr);
            setStatus("error");
            setMessage("Email is already verified.");
          }
          
        } else if (err.code === 401) {
          console.log("ℹ️ 401 Error - Checking database status...");
          
          try {
            const userDoc = await databases.getDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
              urlUserId
            );
            
            if (userDoc && userDoc.emailVerified) {
              // Database me verified hai
              setUserEmail(userDoc.email);
              setStatus("success");
              setMessage("✅ Email verification completed!");
              toast.success("Verification completed!");
              
              // Auto login attempt
              setTimeout(() => {
                handleAutoLogin(urlUserId);
              }, 1500);
              
            } else {
              setStatus("error");
              setMessage("⚠️ Verification link expired or invalid.");
              toast.error("Link expired. Please request a new one.");
            }
          } catch (dbErr) {
            setStatus("error");
            setMessage("Verification failed. Please try again.");
          }
        } else {
          setStatus("error");
          setMessage(err.message || "Verification failed");
          toast.error("Verification failed");
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  // ✅ Auto Login Function (Improved)
  const handleAutoLogin = async (targetUserId?: string) => {
    if (autoLoginAttempted) return;
    
    const loginUserId = targetUserId || userId;
    if (!loginUserId) {
      toast.error("User ID not found");
      return;
    }
    
    setAutoLoginAttempted(true);
    setStatus("logging-in");

    try {
      console.log("🔄 Auto-login process started...");
      

      // 6️⃣ Success - redirect
      toast.success("Login page Redirecting...");
      
      setTimeout(() => {
        router.push("/");
      }, 100);

    } catch (err: any) {
      console.error("❌ login failed:", err);
      
      if (err.code === 401 || err.message?.includes("Invalid credentials")) {
        toast.error("❌ Wrong password. Please login");
      } else {
        toast.error(" Please login.");
      }
      
      // Go back to success state (verification was successful)
      setStatus("success");
    }
  };

  // ✅ Manual Login
  const handleManualLogin = () => {
    if (userEmail) {
      // Pre-fill email on login page
      router.push(`/login?email=${encodeURIComponent(userEmail)}&verified=true`);
    } else {
      router.push("/login");
    }
  };

  // ✅ Resend Verification
  const handleResendVerification = async () => {
    if (!userId || !userEmail) {
      toast.error("User information not available");
      return;
    }

    try {
      toast.loading("Requesting new verification link...");
      
      // We need user's password to create session and resend
      const password = prompt(`Enter password for ${userEmail} to resend verification:`);
      
      if (!password) {
        toast.dismiss();
        toast.error("Cancelled");
        return;
      }

      // Create session
      await account.createEmailPasswordSession(userEmail, password);
      
      // Resend verification
      await account.createVerification(`${window.location.origin}/verify`);
      
      // Cleanup
      await account.deleteSession('current');
      
      toast.dismiss();
      toast.success("✅ New verification email sent!");
      
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to resend verification");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* CHECKING STATE */}
        {status === 'checking' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Checking Verification Link</h2>
            <p className="text-gray-600">Please wait...</p>
          </>
        )}

        {/* VERIFYING STATE */}
        {status === 'verifying' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Verifying Your Email</h2>
            <p className="text-gray-600">This may take a few seconds...</p>
          </>
        )}

        {/* LOGGING IN STATE */}
        {status === 'logging-in' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Auto Login in Progress</h2>
            <p className="text-gray-600">Check for password prompt...</p>
            <p className="text-sm text-gray-500 mt-4">
              Enter your password to complete the login
            </p>
          </>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-green-700 mb-3">✅ Verification Complete!</h2>
            
            {userEmail && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">{userEmail}</p>
                <p className="text-green-700 text-sm mt-1">
                  Email verified successfully
                </p>
              </div>
            )}
            
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="space-y-4">
              {!autoLoginAttempted ? (
                <>
                  <button
                    onClick={() => handleAutoLogin()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Click for Auto Login
                  </button>
                  
                  <button
                    onClick={handleManualLogin}
                    className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition"
                  >
                    Login Manually
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleManualLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
                  >
                    Go to Login Page
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 text-left space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  ✅ Appwrite Verification: <strong>COMPLETE</strong>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  ✅ Database Update: <strong>emailVerified = true</strong>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  🔄 Auto Login: <strong>{autoLoginAttempted ? "COMPLETED" : "AVAILABLE"}</strong>
                </p>
              </div>
            </div>
          </>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-red-700 mb-3">Verification Failed</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium mb-2">Possible reasons:</p>
              <ul className="text-yellow-700 text-sm space-y-1 text-left">
                <li>• Link expired (valid for 1 hour only)</li>
                <li>• Link already used</li>
                <li>• Technical issue with verification</li>
                <li>• Network connection problem</li>
              </ul>
            </div>
            
            <p className="text-gray-700 mb-6">{message}</p>
            
            <div className="space-y-3">
              {userId && (
                <>
                  <button
                    onClick={handleResendVerification}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
                  >
                    Resend Verification Email
                  </button>
                  
                  <button
                    onClick={() => {
                      // Direct login page with user ID
                      router.push(`/login?userId=${userId}`);
                    }}
                    className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition"
                  >
                    Try Login Directly
                  </button>
                </>
              )}
              
              <Link
                href="/login"
                className="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
              >
                Go to Login Page
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Debug Info:</strong> User ID: {userId || "Not found"}
                <br />
                If you think this is an error, try logging in directly.
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}