"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  title: string;
  shortText: string;
  longText: string;
  buttonText: string;
  buttonUrl: string;
}

export default function RichTextSection({
  title,
  shortText,
  longText,
  buttonText,
  buttonUrl,
}: Props) {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="max-w-[900px] mx-auto px-5 text-center">

        {/* ----------- TITLE ----------- */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[28px] md:text-[36px] font-semibold mb-6 text-[#121212]"
        >
          {title}
        </motion.h2>

        {/* ----------- SHORT TEXT ----------- */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[16px] leading-[1.7] text-gray-700"
        >
          {shortText}
        </motion.p>

        {/* ----------- LONG TEXT (TOGGLE) ----------- */}
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[16px] leading-[1.7] text-gray-700 mt-4"
          >
            <div dangerouslySetInnerHTML={{ __html: longText }} />
          </motion.div>
        )}

        {/* ----------- READ MORE BUTTON ----------- */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="mt-4 inline-flex items-center gap-1 text-white font-semibold text-[16px] bg-green-800 px-[1vh] rounded-sm "
        >
          <span className="text-[20px]">{showMore ? "-" : "+"}</span>
          {showMore ? " Read Less " : "Read More"}
        </button>

        {/* ----------- CTA BUTTON ----------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href={buttonUrl}
            className="
              bg-[#063E09] text-white px-8 py-3 rounded-md text-[15px] 
              hover:bg-green-900 transition font-medium
            "
          >
            {buttonText}
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
