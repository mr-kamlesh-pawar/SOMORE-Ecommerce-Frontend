"use client";

import Image from "next/image";
import Link from "next/link";
import { suggestedProductData } from "@/data/suggestedProductData";

export default function SuggestedProduct() {
  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-[1600px] mx-auto space-y-20">

        {suggestedProductData.map((item, index) => {
          const reverse = index % 2 !== 0; // every second item reversed

          return (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 items-center ${
                reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* =============== IMAGE =============== */}
              <div
                className={`relative w-full min-h-[450px] md:min-h-[650px] bg-white ${
                  reverse ? "md:order-2" : "md:order-1"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  className="object-contain md:object-cover"
                />
              </div>

              {/* =============== TEXT =============== */}
              <div
                className={`flex items-center bg-white ${
                  reverse ? "md:order-1" : "md:order-2"
                }`}
              >
                <div className="w-full px-6 md:px-20 py-10">
                  
                  {item.tag && (
                    <p className="uppercase text-sm tracking-[0.25em] text-gray-600 mb-4">
                      {item.tag}
                    </p>
                  )}

                  <h2 className="text-[42px] md:text-[54px] font-light text-black mb-6 leading-[1.2]">
                    {item.title}
                  </h2>

                  {item?.description && (
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed max-w-[550px]">
                      {item.description}
                    </p>
                  )}

                  <Link
                    href={item.link}
                    className="inline-block border border-black px-6 py-3 text-black text-base font-normal tracking-wide hover:bg-black hover:text-white transition-colors"
                  >
                    {item.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
