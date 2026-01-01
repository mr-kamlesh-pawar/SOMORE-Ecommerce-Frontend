import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CheckoutBtn = ({ disabled = false }: { disabled?: boolean }) => {
  // 🔒 Disabled state (NO navigation)
  if (disabled) {
    return (
      <button
        disabled
        className="
          w-full flex items-center justify-center gap-3 my-2 text-xl
          bg-gray-400 text-white py-3 px-8 rounded-full
          cursor-not-allowed opacity-70
        "
      >
        <ArrowRight /> Checkout Now
      </button>
    );
  }

  // ✅ Enabled state (Navigation allowed)
  return (
    <Link
      href="/checkout/address"
      className="
        w-full flex items-center justify-center gap-3 my-2 text-xl
        bg-[#063E09] text-white py-3 px-8 rounded-full
        hover:bg-[#07700c] focus:outline-none
      "
    >
      <ArrowRight /> Checkout Now
    </Link>
  );
};

export default CheckoutBtn;
