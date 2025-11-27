import Image from "next/image";
import React from "react";

export default function AboutPageThree() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* ---------------- INTRO SECTION ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Story */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Saptamveda was born from a simple belief — <strong>nature heals better than chemicals</strong>.
            In a world full of processed supplements, we wanted to bring back 
            the purity and strength of organically grown herbs.
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            We work closely with Indian farmers who cultivate natural crops and herbal plants 
            using traditional and organic practices.  
            Our mission is to deliver <strong>pure, potent and chemical-free Ayurvedic supplements</strong> 
            that nurture your body and calm your soul.
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="relative w-full h-[340px] md:h-[420px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/images/about/aboutus.png"
            alt="About Saptamveda"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* ---------------- OUR TEAM SECTION ---------------- */}
      <div className="mt-20">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          
          {/* TEAM CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-[18rem]">
              <Image
                src="/images/people/person.jpg"
                alt="Founder"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ananya Sharma
              </h3>
              <p className="text-gray-700 dark:text-gray-300">Founder</p>
            </div>
          </div>

          {/* TEAM CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-[18rem]">
              <Image
                src="/images/people/person.jpg"
                alt="Co-founder"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rohan Verma
              </h3>
              <p className="text-gray-700 dark:text-gray-300">Co-Founder & Herbal Specialist</p>
            </div>
          </div>

          {/* TEAM CARD */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-[18rem]">
              <Image
                  src="/images/people/person.jpg"
                alt="Nutrition Expert"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dr. Kavita Deshmukh
              </h3>
              <p className="text-gray-700 dark:text-gray-300">Ayurvedic Nutrition Expert</p>
            </div>
          </div>
        </div>
      </div>

     {/* ---------------- HERBAL MISSION / VALUES / VISION ---------------- */}
<div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">

  {/* Mission */}
  <div className="
    bg-gradient-to-br from-green-50 to-white
    dark:from-gray-800 dark:to-gray-900
    border border-green-200 dark:border-gray-700
    rounded-2xl shadow-md p-8 hover:shadow-xl
    transition-all duration-300 group
  ">
    <div className="flex items-center gap-3 mb-4">
      <span className="
        w-12 h-12 rounded-full 
        bg-green-100 group-hover:bg-green-200 
        flex items-center justify-center 
        transition duration-300
      ">
        🌱
      </span>
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
        Our Mission
      </h2>
    </div>

    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
      To reconnect people with nature through <strong>100% organic, herbal and Ayurvedic supplements</strong>
      that heal the body, enhance immunity, and restore holistic balance.
    </p>
  </div>

  {/* Values */}
  <div className="
    bg-gradient-to-br from-yellow-50 to-white
    dark:from-gray-800 dark:to-gray-900
    border border-yellow-200 dark:border-gray-700
    rounded-2xl shadow-md p-8 hover:shadow-xl
    transition-all duration-300 group
  ">
    <div className="flex items-center gap-3 mb-4">
      <span className="
        w-12 h-12 rounded-full 
        bg-yellow-100 group-hover:bg-yellow-200 
        flex items-center justify-center 
        transition duration-300
      ">
        🍃
      </span>
      <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
        Our Values
      </h2>
    </div>

    <ul className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
      <li className="flex items-start gap-2">
        ✔️ Purity & transparency in every step  
      </li>
      <li className="flex items-start gap-2">
        ✔️ Supporting local organic farmers  
      </li>
      <li className="flex items-start gap-2">
        ✔️ Chemical-free & naturally processed  
      </li>
      <li className="flex items-start gap-2">
        ✔️ Honest, result-driven formulations  
      </li>
      <li className="flex items-start gap-2">
        ✔️ Customer-first, wellness-centered  
      </li>
    </ul>
  </div>

  {/* Vision */}
  <div className="
    bg-gradient-to-br from-green-50 to-white
    dark:from-gray-800 dark:to-gray-900
    border border-green-200 dark:border-gray-700
    rounded-2xl shadow-md p-8 hover:shadow-xl
    transition-all duration-300 group
  ">
    <div className="flex items-center gap-3 mb-4">
      <span className="
        w-12 h-12 rounded-full 
        bg-green-100 group-hover:bg-green-200 
        flex items-center justify-center 
        transition duration-300
      ">
        🌿
      </span>
      <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">
        Our Vision
      </h2>
    </div>

    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
      To become India’s most trusted Ayurvedic wellness brand—bringing nature’s wisdom, 
      purity, and healing power to every household through organic supplements.
    </p>
  </div>

</div>


    </div>
  );
}
