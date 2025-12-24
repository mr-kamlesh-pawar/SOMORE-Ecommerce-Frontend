"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { account, databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/AuthContext";
import toast from "react-hot-toast";


export default function RegisterPage() {
  const { loading: authLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔐 Auth decision AFTER hydration (safe)
  if (authLoading) return null; // or spinner

  if (isLoggedIn) {
    router.replace("/");
    return null;
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

    if (!firstName || !lastName) {
      alert("❌ First and last name required");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      alert("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const user = await account.create(
        ID.unique(),
        email,
        password,
        `${firstName} ${lastName}`
      );

      console.log("✅ Account created:", user.$id);
      console.log("📧 Email verification status:", user.emailVerification);

      // 2️⃣ IMPORTANT: Current guest session delete karo
      console.log("🔄 Deleting guest session...");
      try {
        await account.deleteSession('current');
        console.log("✅ Guest session deleted");
      } catch (sessionErr) {
        console.log("⚠️ No session to delete, continuing...");
      }

      // 3️⃣ Email-password session create karo (proper user session)
      console.log("🔄 Creating user session...");
      const session = await account.createEmailPasswordSession(email, password);
      console.log("✅ User session created:", session.$id);

      // 4️⃣ Now send verification email with proper user session
      console.log("🔄 Sending verification email...");
      const verificationUrl = `${window.location.origin}/verify`;
      console.log("📤 Verification URL:", verificationUrl);
      
      await account.createVerification(verificationUrl);
      console.log("✅ Verification email sent!");

      // 5️⃣ Session delete karo (optional, for security)
      console.log("🔄 Deleting user session...");
      await account.deleteSession(session.$id);
      console.log("✅ Session cleaned up");

      // 6️⃣ Database me user details save karo
      console.log("🔄 Saving user to database...");

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        user.$id,
        {
          firstName,
          lastName,
          email,
          phone,
          role: "user",
           emailVerified: false,
            accountStatus: "pending_verification",
        }
      );


 // 7️⃣ Success message
      toast.success("🎉 Account created! Please check your email for verification link.");
      
      // 8️⃣ Redirect to verify-pending page
      setTimeout(() => {
        router.push(`/verify-pending?email=${encodeURIComponent(email)}`);
      }, 1000);

    } catch (err: any) {
      console.error("❌ Registration error:", err);
      
      // Specific error messages
      if (err.message.includes("guests missing scopes")) {
        toast.error("Authentication error. Please try again.");
      } else if (err.code === 409) {
        toast.error("User with this email already exists");
      } else if (err.code === 400) {
        toast.error("Invalid email or password format");
      } else {
        toast.error(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-semibold text-center">Create an Account</h2>

        <form onSubmit={handleRegister} className="space-y-6 mt-6">

          {/* FIRST + LAST NAME */}
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" required placeholder="First Name" className="border rounded-lg px-4 py-3" />
            <input name="lastName" required placeholder="Last Name" className="border rounded-lg px-4 py-3" />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full border rounded-lg pl-10 pr-4 py-3"
            />
          </div>

          {/* PHONE */}
          <input
            name="phone"
            type="tel"
            required
            placeholder="Mobile Number"
            className="w-full border rounded-lg px-4 py-3"
          />

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full border rounded-lg pl-10 pr-12 py-3"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="confirm"
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Confirm Password"
              className="w-full border rounded-lg pl-10 pr-12 py-3"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3">
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-800"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

      </div>
    </div>
  );
}
