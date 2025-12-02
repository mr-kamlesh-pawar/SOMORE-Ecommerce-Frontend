import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CheckoutBtn = () => {
  return (
    <Link
      href={"/checkout"}
      className="w-full flex items-center justify-center gap-3 my-2 text-xl bg-[#063E09] dark:bg-[#063E09] text-white py-3 px-8 rounded-full hover:bg-[#07700c] dark:hover:bg-[#07700c] focus:outline-none"
    >
      {" "}
      <ArrowRight /> Checkout Now
    </Link>
  );
};

export default CheckoutBtn;
