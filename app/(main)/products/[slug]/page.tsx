"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { newLaunchProducts } from "@/data/NewLaunches/newLaunchProducts";
import { useCart } from "@/store/hooks/useCart";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import { herbalProducts } from "@/data/herbalProducts/herbalProducts";
import ReviewSection from "@/components/review/ReviewSection";
import SuggestedProduct from "@/components/others/SuggestedProduct";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product = newLaunchProducts.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);

  const router = useRouter();


  const { dispatch } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  return (
    <>
      {/* ---------------- MAIN PRODUCT SECTION ---------------- */}
      <section className="max-w-[1500px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ---------------- LEFT: Image Gallery ---------------- */}
          <div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white border">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-24 h-24 rounded-xl cursor-pointer border ${
                    selectedImage === i ? "border-black" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt="product thumbnail"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- RIGHT: Product Info ---------------- */}
          <div className="relative">

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-xl">★★★★★</span>
              <p className="text-gray-600 text-sm">
                {product.rating.reviews} reviews
              </p>
            </div>

            {/* Price Box */}
            <div className="mt-4">
              <p className="text-4xl font-bold text-red-600">
                Rs. {product.price}
              </p>

              <p className="text-gray-600 text-sm mt-1">
                Taxes included.{" "}
                <span className="underline cursor-pointer">
                  Shipping calculated at checkout.
                </span>
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <p className="font-medium mb-2">Quantity</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => qty > 1 && setQty(qty - 1)}
                  className="w-10 h-10 bg-gray-200 text-lg rounded flex justify-center items-center"
                >
                  –
                </button>

                <span className="text-lg font-semibold">{qty}</span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 bg-gray-200 text-lg rounded flex justify-center items-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Offer Box */}
            <div className="mt-6 bg-orange-50 border border-orange-200 p-5 rounded-lg space-y-4">
              {product.offers?.map((offer, i) => (
                <div key={i}>
                  <p className="text-red-700 font-bold">{offer.title}</p>
                  <p className="text-gray-800 text-sm">
                    {offer.subtitle}
                    {offer.coupon && (
                      <span className="font-bold"> Use Coupon : {offer.coupon}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
             <button
  className="w-full border border-black text-black py-4 rounded text-lg font-medium hover:bg-gray-100"
  onClick={() => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.title,
        price: product.price,
        images: product.images,
        quantity: qty,
      },
    });

    toast.success("Product added to cart!");

    setTimeout(() => {
      router.push("/cart");
    }, 500); // Small delay for toast visibility
  }}
>
  Add to cart
</button>


             <button
  className="w-full bg-black text-white py-4 rounded text-lg font-semibold hover:bg-gray-900 flex justify-center items-center gap-2"
  onClick={() => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.title,
        price: product.price,
        images: product.images,
        quantity: qty,
      },
    });

    toast.success("Redirecting to checkout...");

    setTimeout(() => {
      router.push("/cart");
    }, 500);
  }}
>
  BUY NOW
  <Image src="/upi-icons.png" width={40} height={20} alt="upi" />
</button>

            </div>

            {/* ---------------- SCROLLING DESCRIPTION FIX ---------------- */}
    <div
  className="
    mt-10
    prose prose-lg prose-gray
    prose-headings:text-black
    prose-h3:font-semibold
    prose-h3:text-[22px]
    prose-p:text-gray-800
    prose-strong:font-bold
    prose-ul:list-disc prose-ul:pl-6
    prose-li:my-1
    prose-img:rounded-lg prose-img:border
    max-w-none

    lg:max-h-[400px] 
    lg:overflow-y-auto 
    pr-3 
    lg:scrollbar-thin 
    lg:scrollbar-thumb-gray-300 
    lg:scrollbar-track-transparent
  "
  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
/>


            {/* ------------------------------------------------------------ */}

          </div>
        </div>
      </section>

    {/* ---------------- Sticky Add to Cart ---------------- */}
<div
  className={`z-[100] fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg 
  transition-all duration-500 
  ${showSticky ? "translate-y-0" : "translate-y-full"}
  `}
>
  <div className="max-w-[1500px] mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">

    {/* LEFT: Image + Title */}
    <div className="flex items-center gap-3 sm:gap-4 w-[65%] sm:w-auto">

      {/* Thumbnail */}
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        <Image
          src={product.images[0]}
          alt="product"
          fill
          className="object-cover rounded"
        />
      </div>

      {/* Title */}
      <p className="
        font-medium 
        text-xs sm:text-sm 
        max-w-[180px] sm:max-w-[260px] 
        line-clamp-2
      ">
        {product.title}
      </p>
    </div>

    {/* RIGHT: Button */}
    <button
      className="
        bg-black text-white 
        px-4 py-2 
        sm:px-6 sm:py-3 
        rounded-lg 
        text-xs sm:text-sm 
        font-semibold 
        flex-shrink-0
      "
       onClick={() => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.title,
        price: product.price,
        images: product.images,
        quantity: qty,
      },
    });
  }}
    >
      Add to cart
    </button>
  </div>
</div>

<ReviewSection/>

<br />
   <FeaturedCollection
  title="Best Online Store for Herbal Products and Supplements"
  products={herbalProducts}
  viewAllUrl="/collections/herbal"
 />


 <SuggestedProduct/>
    </>
  );
}
