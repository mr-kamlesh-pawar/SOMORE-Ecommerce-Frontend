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

        <h2 className="text-center text-2xl md:text-4xl font-bold text-black tracking-wide mb-6 md:mb-10">
          Here's What Our Customers Have To Say About Us
        </h2>
          

        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="space-x-4 px-2 lg:px-6">
            {testinomials.map((testi) => (
              <CarouselItem
                key={testi.id}
                className="md:basis-1/3 pl-2 md:pl-4 mb-2"
              >
                {/* FIXED HEIGHT CARD */}
                <div
                  className="
                    bg-gray-100 dark:bg-gray-700 
                    rounded-lg overflow-hidden shadow-lg
                    flex flex-col
                  "
                >
                  {/* CONTENT SCROLL AREA */}
                  <div className="p-6 flex flex-col flex-1 overflow-y-auto space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {testi.content.substring(0,210)+"...."}
                    </p>

                    {/* USER INFO */}
                    <div className="flex items-center mt-auto">
                      <Image
                        src={testi.image}
                        alt="User"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {testi.name}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
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
