"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { bannerData } from "@/data/banner/bannerData";

export default function HeroBannerOne() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Sync dots with slider
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="relative w-full bg-white">
      {/* BANNER CONTAINER - Shopify Style (auto height) */}
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
          className="w-full"
        >
          <CarouselContent>
            {bannerData.map((slide, index) => (
              <CarouselItem key={index}>
                <Link href={slide.link ?? "#"} className="block w-full">
                 
                  <div className="relative w-full 
  h-[40vh] sm:h-[60vh] md:h-[75vh] 
  lg:h-[110vh]"
>

                    <Image
                      src={slide.images[0]}
                      fill
                      priority={index === 0}
                      alt={slide.title}
                     className="w-full h-full
  object-contain
  lg:object-cover
"

                    />
                  </div>

                  
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

       

        
        </Carousel>
      </div>

      {/* DOTS - BELOW THE BANNER (Shopify Exact Behaviour) */}
      <div className="w-full flex justify-center py-2 lg:py-4 ">
           <svg className="w-4 h-4 rotate-90 mx-2" viewBox="0 0 10 6">
              <path
                fill="currentColor"
                d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
              />
            </svg>
        <div className="flex gap-3 slideshow__control-wrapper">
          {bannerData.map((_, i) => {
            const active = i === current;
            return (
              <>
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active ? "true" : undefined}
                className={`
                  slider-counter__link slider-counter__link--dots
                  ${active ? "slider-counter__link--active" : ""}
                  `}
                  >
                <span className="dot"></span>
              </button>
                </>
            );
          })}
        </div>

           <svg className="w-4 h-4 -rotate-90 mx-2" viewBox="0 0 10 6">
              <path
                fill="currentColor"
                d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
              />
            </svg>

        <style jsx>{`
          .slider-counter__link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: none;
            background: transparent;
            cursor: pointer;
          }

          .dot {
            width: 9px;
            height: 9px;
            border-radius: 9999px;
            background: rgba(18, 18, 18, 0.25);
            transition: transform 0.25s ease, background 0.25s ease;
          }

          .slider-counter__link--active .dot {
            background: rgba(18, 18, 18, 0.95);
            transform: scale(1.25);
          }

          :global(.dark) .dot {
            background: rgba(255, 255, 255, 0.3);
          }

          :global(.dark) .slider-counter__link--active .dot {
            background: rgba(255, 255, 255, 1);
          }
        `}</style>
      </div>
    </section>
  );
}
