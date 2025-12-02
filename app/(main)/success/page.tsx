"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown Timer
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect at 0
    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">

      {/* Success Icon */}
      <CheckCircle size={90} className="text-green-600 animate-bounce mb-6" />

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        Order Placed Successfully 🎉
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-3 max-w-xl">
        Thank you for your purchase! Your order has been placed successfully.
        Redirecting to home in <strong>{countdown} seconds...</strong>
      </p>

      {/* Go Home Button */}
      <Link
        href="/"
        className="mt-8 bg-black text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition"
      >
        Go to Homepage
      </Link>
    </section>
  );
}
