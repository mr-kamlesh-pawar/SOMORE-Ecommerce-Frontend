"use client";

import Link from "next/link";
import { ArrowLeft, Leaf, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <section className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center px-6 py-10 text-center">
      
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Leaf size={70} className="text-[#2D7A3E]" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold text-[#1A1A1A]"
      >
        404 – Page Not Found
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mt-4 text-gray-600 max-w-xl"
      >
        Saptamveda is a brand dedicated to organically cultivated herbal supplements.  
        Looks like the page you&apos;re searching for has wandered off into nature 🌿
      </motion.p>

      {/* Illustration */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="mt-10"
      >
        <Image
          src="/logo.png" 
          alt="Not Found"
          width={320}
          height={320}
          className="mx-auto w-[240px] md:w-[300px] h-auto"
        />
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2D7A3E] text-white rounded-lg text-lg font-medium hover:bg-[#256634] transition"
        >
          <ArrowLeft size={20} /> Go Back Home
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-[#2D7A3E] text-[#2D7A3E] rounded-lg text-lg font-medium hover:bg-[#2D7A3E] hover:text-white transition"
        >
          <RefreshCcw size={20} /> Reload Page
        </button>
      </motion.div>
    </section>
  );
}
