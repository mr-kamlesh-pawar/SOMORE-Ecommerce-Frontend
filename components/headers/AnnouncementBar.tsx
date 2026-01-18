"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: number;
  message: string;
  link?: string;
}

const announcements: Announcement[] = [
  {
    id: 1,
    message: "Extra 10% OFF on your order. Order Now",
    link: "/products",
  },
  {
    id: 2,
    message: "Buy 2, Get 1 FREE - SPECIAL DISCOUNT",
    link: "/products",
  },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? announcements.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  const current = announcements[index];

  return (
    <div
      className="w-full py-2 text-white text-center"
      style={{
        background: "var(--gradient-background, #063e09)",
      }}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 gap-4">
        
        {/* PREV BUTTON */}
        <button
          onClick={prevSlide}
          className="p-1 opacity-70 hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>

        {/* SLIDE CONTENT */}
        <div className="flex-1 text-center">
          {current.link ? (
            <Link href={current.link}>
              <p className="text-sm md:text-base underline-offset-2 hover:underline">
                {current.message}
              </p>
            </Link>
          ) : (
            <p className="text-sm md:text-base">{current.message}</p>
          )}
        </div>

        {/* NEXT BUTTON */}
        <button
          onClick={nextSlide}
          className="p-1 opacity-70 hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
