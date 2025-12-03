"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { account } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // If user already logged in → redirect
  useEffect(() => {
    account.get().then(() => {
      router.push("/");
    }).catch(() => {});
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    console.log(email);
    console.log(password)

    try {
     
      await account.createEmailPasswordSession(email, password);

      const user = await account.get();

      if (!user.emailVerification) {
        toast.error("Please verify your email before logging in ⚠️");
        await account.deleteSession("current");
        setLoading(false);
        return;
      }

      const jwtToken = await account.createJWT();
      localStorage.setItem("appwrite_jwt", jwtToken.jwt);

      toast.success("Login successful 🎉");
      router.push("/");

    } catch (err: any) {
      toast.error(err.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/login`
    );
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

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg mt-6"
        >
          <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={22} height={22} alt="Google" />
          Continue with Google
        </button>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link href="/register" className="underline text-black">Create one</Link>
        </p>

      </div>
    </div>
  );
}
