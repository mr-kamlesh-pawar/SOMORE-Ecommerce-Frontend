"use client";

import { WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <WifiOff size={72} className="text-red-600 mb-6" />

      <h1 className="text-3xl font-bold mb-2">
        You&apos;re Offline
      </h1>

      <p className="text-gray-600 text-center max-w-md">
        Please check your internet connection.
        This page is available offline.
      </p>

      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Retry
      </button>
    </div>
  );
}
