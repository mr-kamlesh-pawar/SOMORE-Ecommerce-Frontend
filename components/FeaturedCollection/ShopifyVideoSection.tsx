"use client";

import React from "react";

export default function ShopifyVideoSection() {
  return (
    <section className="w-full bg-white">
      {/* Shopify Padding Logic */}
      <div
        className="
          pt-12 pb-14 
          md:pt-12 md:pb-14
          bg-white
        "
      >
        {/* Gradient Background (Shopify style) */}
        <div className="w-full bg-gradient-to-b from-white to-white">

          {/* VIDEO WRAPPER */}
          <div className="w-full max-w-[1600px] mx-auto ">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full block mx-auto rounded-none"
            >
              {/* fallback sources */}
              <source
                src="https://cdn.shopify.com/videos/c/o/v/7614b04ee150430787e635262108ae90.mp4"
                type="video/mp4"
              />
              <source src="/media/cc0-videos/flower.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

        </div>
      </div>
    </section>
  );
}
