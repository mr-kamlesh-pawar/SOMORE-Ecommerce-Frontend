// components/Footer.tsx
"use client";

import { useState, useEffect } from "react";
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
import { fetchCategories, type Category } from "@/lib/category-service";

// ICON MAP (string → component)
const iconsMap: any = {
  Instagram: <Instagram className="w-5 h-5" />,
  Facebook: <Facebook className="w-5 h-5" />,
  Youtube: <Youtube className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5 text-[#2D7A3E]" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5 text-[#2D7A3E]" />,
};

// Type for footer link items
interface FooterLink {
  id: string | number;
  label: string;
  url: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await fetchCategories();
        
        // Transform categories to footer link format
        const categoryLinks: FooterLink[] = fetchedCategories.map(category => ({
          id: category.$id,
          label: category.name,
          url: `/category/${category.name}`,
        }));

        setCategories(categoryLinks);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <footer className="bg-[#FAFAFA] text-[#1A1A1A] pt-16">
      <div className="max-w-[1400px] mx-auto px-5">
        {/* ---------- TOP GRID ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-200">
          {/* BRAND */}
          <div className="space-y-4">
            <Image
              src={footerData.brand.logo}
              alt="Logo"
              width={170}
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
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#2D7A3E] hover:text-white transition"
                >
                  {iconsMap[item.icon]}
                </a>
              ))}
            </div>
          </div>

          {/* SHOP - Categories from database */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-semibold">Shop</h3>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="flex flex-col gap-3">
                {categories.slice(0, 5).map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    className="text-sm text-gray-600 hover:text-[#2D7A3E] hover:translate-x-1 transition"
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Add "View All" link */}
                {categories.length > 5 && (
                  <Link
                    href="/products"
                    className="text-sm text-[#2D7A3E] font-medium hover:underline transition"
                  >
                    View All Categories →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No categories available</p>
            )}
          </div>

          {/* COMPANY */}
          <div className="space-y-4">
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
          <div className="space-y-4">
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
              rel="noopener noreferrer"
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
            © {new Date().getFullYear()} Somore Pure. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {footerData.payments.map((svg, i) => (
              <div key={i} className="opacity-75 hover:opacity-100 transition">
                {svg}
              </div>
            ))}
          </div>

         <div className="flex flex-col sm:flex-row items-center gap-2">
  <p className="text-xs text-gray-500 opacity-70">Powered by Somore Pure</p>
  <span className="hidden sm:inline text-gray-300">|</span>
  <p className="text-xs text-gray-500 opacity-70">
    Developed by{" "}
    <a 
      href="https://www.linkedin.com/in/mr-kamlesh-pawar/" 
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#2D7A3E] hover:underline transition"
    >
      Kamlesh
    </a>{" "}
    &{" "}
    <a 
      href="https://www.linkedin.com/in/siddhesh-patole-b1b365259/" 
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#2D7A3E] hover:underline transition"
    >
      Siddesh
    </a>
  </p>
</div>
        
        </div>
      </div>
    </footer>
  );
}