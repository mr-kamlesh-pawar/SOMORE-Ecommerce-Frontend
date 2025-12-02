"use client";

import { useState } from "react";
import Image from "next/image"; // <-- REQUIRED IMPORT
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = (e: any) => {
    e.preventDefault();
    // Add login logic here
  };

  const handleGoogleLogin = () => {
    console.log("Google Login Triggered");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm sm:text-base">
          Login to continue your journey
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full border rounded-lg pl-10 pr-4 py-3 text-sm sm:text-base outline-none 
                focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="w-full border rounded-lg pl-10 pr-12 py-3 text-sm sm:text-base outline-none 
                focus:ring-2 focus:ring-black"
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
             {/* Forgot Password */}
        <p className="text-end mr-2 text-sm text-gray-600 mt-6">
          <Link href="/forgot-password" className="text-black underline">
             Forgot password?
          </Link>
        </p>
          </div>



          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-3 rounded-lg text-base font-medium 
            hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg 
          hover:bg-gray-100 transition"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={22}
            height={22}
            alt="Google"
          />
          <span className="text-sm sm:text-base font-medium">Continue with Google</span>
        </button>

       

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-2">
          Don’t have an account?{" "}
          <a href="/register" className="text-black underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
