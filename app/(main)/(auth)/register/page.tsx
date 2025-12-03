"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { account } from "@/lib/appwrite";
import { ID, OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirm = e.target.confirm.value.trim();

    // VALIDATIONS
    if (!name) {
      alert("❌ Name is required!");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      alert("❌ Enter a valid email!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("❌ Password must be at least 6 characters!");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      alert("❌ Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Create Appwrite user
      await account.create(ID.unique(), email, password, name);

      alert("🎉 Account created successfully! Please login now.");
      router.push("/login");

    } catch (err: any) {
      console.error(err);
      alert("❌ Registration Failed: " + err.message);
    }

    setLoading(false);
  };

  const handleGoogleSignup = () => {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/register`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
        
        <h2 className="text-3xl font-semibold text-center">Create an Account</h2>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-6 mt-6">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="name"
                required
                placeholder="John Doe"
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="email"
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full border rounded-lg pl-10 pr-4 py-3"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create password"
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

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                name="confirm"
                type={showConfirm ? "text" : "password"}
                required
                placeholder="Confirm password"
                className="w-full border rounded-lg pl-10 pr-12 py-3"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg text-lg"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* GOOGLE LOGIN */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg"
        >
          <Image 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={22}
            height={22}
            alt="Google"
          />
          <span>Sign Up with Google</span>
        </button>

      </div>
    </div>
  );
}
