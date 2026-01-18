"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { getAppwriteImageUrl } from "@/lib/appwriteImage";
import HeroBannerSkeleton from "@/components/skeleton/HeroBannerSkeleton";

interface Banner {
  $id: string;
  name: string;
  bannerimg: string; // image ID
  $updatedAt: string;
}

export default function HeroBannerOne() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch banners from Appwrite
  async function fetchBanners() {
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_BANNERS_COLLECTION_ID!,
        [Query.orderAsc("$createdAt")]
      );

      setBanners(res.documents as any);
    } catch (err) {
      console.error("Banner fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBanners();
  }, []);

  // Sync dots
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (loading) return <HeroBannerSkeleton />;

  if (!banners.length) return null;

  return (
    <section className="relative w-full bg-white">
      <div className="relative w-full overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={banner.$id}>
                <Link href="/products" className="block w-full">
                  <div
                    className="
                      relative w-full 
                      h-[30vh] sm:h-[35vh] md:h-[45vh] 
                      lg:h-[110vh]
                    "
                  >
                    <Image
                      src={getAppwriteImageUrl(
                        banner.bannerimg,
                        banner.$updatedAt
                      )}
                      alt={banner.name}
                      fill
                      priority={index === 0}
                      className="object-contain lg:object-cover"
                      unoptimized
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* DOTS */}
      <div className="w-full flex justify-center py-3 gap-3">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`w-2 h-2 rounded-full transition ${
              i === current ? "bg-black scale-125" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
