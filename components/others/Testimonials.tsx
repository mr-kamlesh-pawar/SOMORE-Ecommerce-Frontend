"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { testinomials } from "@/data/testimonials/testimonialData";
import Autoplay from "embla-carousel-autoplay";

const TestimonialsSection = ({ textCenter }: { textCenter: boolean }) => {
  return (
    <div className="py-16 my-8 bg-[#F8F8F8] dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Heading with proper apostrophe */}
        <h2 className="text-center text-2xl md:text-4xl font-bold text-black tracking-wide mb-6 md:mb-10">
          Here&apos;s What Our Customers Have To Say About Us
        </h2>

        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          opts={{
            loop: true, // Add loop for continuous scrolling
            align: "start", // Better alignment
          }}
        >
          <CarouselContent className="-ml-4"> {/* Fixed spacing */}
            {testinomials.map((testi) => (
              <CarouselItem
                key={testi.id}
                className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3" // Responsive sizing
              >
                {/* Card with consistent height */}
                <div
                  className="
                    bg-white dark:bg-gray-700  /* Changed from gray-100 to white */
                    rounded-lg overflow-hidden shadow-lg
                    flex flex-col h-full  /* Ensure full height */
                    border border-gray-200 dark:border-gray-600  /* Add subtle border */
                  "
                >
                  {/* Content area */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Quote content with proper ellipsis */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                      {testi.content.length > 210 
                        ? `${testi.content.substring(0, 210)}...` 
                        : testi.content}
                    </p>

                    {/* User info - fixed to bottom */}
                    <div className="flex items-center pt-4 border-t border-gray-100 dark:border-gray-600 mt-auto">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={testi.image}
                          alt={`${testi.name}'s profile`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1"> {/* Prevent text overflow */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {testi.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                          {testi.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default TestimonialsSection;