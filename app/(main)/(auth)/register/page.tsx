"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const handleRegister = (e: any) => {
    e.preventDefault();
    console.log("Register Submit");
  };

  const handleGoogleSignup = () => {
    console.log("Google Signup Triggered");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm sm:text-base">
          Join us to continue your journey
        </p>

        {/* ------------------ FORM ------------------ */}
        <form onSubmit={handleRegister} className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full border rounded-lg pl-10 pr-4 py-3 text-sm sm:text-base 
                outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                className="w-full border rounded-lg pl-10 pr-4 py-3 text-sm sm:text-base 
                outline-none focus:ring-2 focus:ring-black"
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
                placeholder="Create your password"
                className="w-full border rounded-lg pl-10 pr-12 py-3 text-sm sm:text-base 
                outline-none focus:ring-2 focus:ring-black"
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />

              <input
                type={showConfirm ? "text" : "password"}
                required
                placeholder="Confirm your password"
                className="w-full border rounded-lg pl-10 pr-12 py-3 text-sm sm:text-base 
                outline-none focus:ring-2 focus:ring-black"
              />

              <button
                type="button"
                onClick={toggleConfirm}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-3 rounded-lg text-lg font-medium 
            hover:bg-gray-900 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg 
          hover:bg-gray-100 transition"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={22}
            height={22}
            alt="Google"
          />
          <span className="text-sm sm:text-base font-medium">
            Sign up with Google
          </span>
        </button>

        {/* Already have account */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-black underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
