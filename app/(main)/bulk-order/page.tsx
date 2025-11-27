"use client";

import React, { useState, useRef } from "react";
import { Phone, Mail, User, Package, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function BulkOrderPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    quantity: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({});

  // Refs to focus fields on validation error
  const refs: any = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    product: useRef<HTMLInputElement>(null),
    quantity: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Remove error when user types
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.product.trim()) newErrors.product = "Product name is required";
    if (!form.quantity.trim()) newErrors.quantity = "Quantity is required";

    // return errors if exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const firstErrorKey = Object.keys(newErrors)[0];

      // Focus & scroll to the field causing first error
      refs[firstErrorKey].current?.focus();
      refs[firstErrorKey].current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return false;
    }

    return true;
  };

  const whatsappSubmit = () => {
    if (!validateForm()) return;

    const text = `
🛒 *Bulk Order Request – Saptamveda*
----------------------------------
👤 Name: ${form.name}
📧 Email: ${form.email}
📞 Phone: ${form.phone}

📦 Product: ${form.product}
🔢 Quantity: ${form.quantity}

💬 Message:
${form.message}
`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/9511215942?text=${encoded}`, "_blank");
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA] px-5 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            Bulk Order Inquiry
          </h1>
          <p className="mt-2 text-gray-600">
            For wholesale, corporate gifting, or large quantity orders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* FORM SECTION */}
          <div className="flex flex-col gap-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <User size={18} /> Full Name
              </label>
              <input
                ref={refs.name}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 outline-none bg-gray-100 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Mail size={18} /> Email Address
              </label>
              <input
                ref={refs.email}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 outline-none bg-gray-100 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Phone size={18} /> Phone Number
              </label>
              <input
                ref={refs.phone}
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 outline-none bg-gray-100 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your phone"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* PRODUCT */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Package size={18} /> Product Name
              </label>
              <input
                ref={refs.product}
                type="text"
                name="product"
                value={form.product}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 outline-none bg-gray-100 ${
                  errors.product ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Which product do you want?"
              />
              {errors.product && (
                <p className="text-red-500 text-sm mt-1">{errors.product}</p>
              )}
            </div>

            {/* QUANTITY */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Package size={18} /> Required Quantity
              </label>
              <input
                ref={refs.quantity}
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 outline-none bg-gray-100 ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* MESSAGE */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <MessageCircle size={18} /> Message
              </label>
              <textarea
                ref={refs.message}
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className={`w-full border rounded-lg px-4 py-3 outline-none bg-gray-100 ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your custom message or requirement"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* WHATSAPP BUTTON */}
            <button
              onClick={whatsappSubmit}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE57] text-white font-medium py-3 rounded-lg transition-all"
            >
              <MessageCircle size={20} />
              Send via WhatsApp
            </button>
          </div>

          {/* IMAGE SIDE */}
          <div className="flex justify-center items-center">
            <Image
              src="/image.png"
              width={400}
              height={400}
              alt="Bulk Order"
              className="w-[260px] sm:w-[330px] md:w-[380px] lg:w-[420px] h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
