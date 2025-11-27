// components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { footerData } from "@/data/footerData";

import {
  Instagram,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

// ICON MAP (string → component)
const iconsMap: any = {
  Instagram: <Instagram className="w-5 h-5" />,
  Facebook: <Facebook className="w-5 h-5" />,
  Youtube: <Youtube className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5 text-[#2D7A3E]" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5 text-[#2D7A3E]" />,
};

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] text-[#1A1A1A] pt-16">
      <div className="max-w-[1400px] mx-auto px-5">
        {/* ---------- TOP GRID ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-200">

          {/* BRAND */}
          <div className="space-y-4 animate-slide-up delay-100">
            <Image
              src={footerData.brand.logo}
              alt="Logo"
              width={200}
              height={60}
              className="mb-3"
            />

            <p className="text-sm text-gray-600 leading-6">
              {footerData.brand.mission}
            </p>

            <div className="flex items-center gap-4">
              {footerData.social.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#2D7A3E] hover:text-white transition"
                >
                  {iconsMap[item.icon]}
                </a>
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div className="space-y-4 animate-slide-up delay-200">
            <h3 className="text-[16px] font-semibold">Shop</h3>
            <div className="flex flex-col gap-3">
              {footerData.shop.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  className="text-sm text-gray-600 hover:text-[#2D7A3E] hover:translate-x-1 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* COMPANY */}
          <div className="space-y-4 animate-slide-up delay-300">
            <h3 className="text-[16px] font-semibold">Company</h3>
            <div className="flex flex-col gap-3">
              {footerData.company.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  className="text-sm text-gray-600 hover:text-[#2D7A3E] hover:translate-x-1 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* SUPPORT */}
          <div className="space-y-4 animate-slide-up delay-400">
            <h3 className="text-[16px] font-semibold">Support</h3>

            {/* Email */}
            <div className="flex items-start gap-3 text-sm text-gray-600">
              {iconsMap[footerData.support.email.icon]}
              <a
                href={`mailto:${footerData.support.email.value}`}
                className="hover:text-[#2D7A3E]"
              >
                {footerData.support.email.value}
              </a>
            </div>

            {/* WhatsApp */}
            <a
              href={footerData.support.whatsapp.url}
              target="_blank"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-full text-sm hover:bg-[#1EBE57] transition"
            >
              {iconsMap[footerData.support.whatsapp.icon]}
              Chat on WhatsApp
            </a>

            {/* Address */}
            <div className="flex items-start gap-3 text-sm text-gray-600">
              {iconsMap[footerData.support.address.icon]}
              <span>{footerData.support.address.value}</span>
            </div>
          </div>
        </div>

        {/* ---------- BOTTOM FOOTER ---------- */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © 2025 Saptamveda. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {footerData.payments.map((svg, i) => (
              <div key={i} className="opacity-75 hover:opacity-100 transition">
                {svg}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 opacity-70">Powered by Somore+</p>
        </div>
      </div>
    </footer>
  );
}
