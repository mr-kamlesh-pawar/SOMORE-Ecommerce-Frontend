"use client";

import { useEffect } from "react";
import { account } from "@/lib/appwrite";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const userId = params.get("userId");
    const secret = params.get("secret");

    if (!userId || !secret) return;

    const verify = async () => {
      try {
        // 🔥 MUST LOGIN FIRST
        await account.get(); // ensures session exists

        await account.updateVerification(userId, secret);

        alert("✅ Email verified successfully!");
        router.replace("/login");
      } catch (err: any) {
        alert("❌ Verification failed or session expired");
      }
    };

    verify();
  }, []);

  return <p>Verifying email…</p>;
}
