"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchActiveOffer, fetchProductBySlug } from "@/lib/product-service";
import { useCart } from "@/store/hooks/useCart";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import { herbalProducts } from "@/data/herbalProducts/herbalProducts";
import ReviewSection from "@/components/review/ReviewSection";
import SuggestedProduct from "@/components/others/SuggestedProduct";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage() {
  const MAX_QTY_PER_PRODUCT = 7;
  const { slug } = useParams();
  const router = useRouter();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        const [productData, offerData] = await Promise.all([
          fetchProductBySlug(slug as string),
          fetchActiveOffer(),
        ]);

        if (!productData) {
          setLoading(false);
          toast.error("Product not found");
          return;
        }

        console.log("📦 Product data from API:", productData); // Debug log

        // ✅ CORRECT MAPPING: Database fields → Frontend expected fields
        const mappedProduct = {
          ...productData,
          title: productData.name, // Database: 'name' → Frontend: 'title'
          descriptionHtml: productData.description + "<br/>" + productData.consume, // Database: 'description'
          compareAtPrice: productData.marketprice, // Database: 'marketprice'
          stock: productData.quantity, // Database: 'quantity' → Frontend: 'stock'
          rating: {
            reviews: productData.reviewcount ?? 0, // Database: 'reviewcount'
            stars: productData.averagerating ?? 0, // Database: 'averagerating'
          },
          // Images are already URLs from API (converted in API route)
          images: productData.images?.length > 0
            ? productData.images
            : ["/images/placeholder.png"],
        };

        console.log("🔄 Mapped product:", mappedProduct); // Debug log

        setProduct(mappedProduct);
        setOffer(offerData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  /* ================= QUANTITY HANDLERS ================= */
  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const increaseQty = () => {
    if (!product) return;

    // 🚫 max 7 limit
    if (qty >= MAX_QTY_PER_PRODUCT) {
      toast.error("Maximum 7 items allowed per order");
      return;
    }

    // 🚫 stock limit (using product.quantity from database)
    if (qty >= product.stock) {
      toast.error("Only limited stock available");
      return;
    }

    setQty(qty + 1);
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (redirectToCart = false) => {
    if (!product) return;

    // ❌ out of stock
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    // ❌ max 7 limit
    if (qty >= MAX_QTY_PER_PRODUCT) {
      toast.error("Maximum 7 items allowed per order");
      return;
    }

    // ❌ stock limit
    if (qty >= product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.$id,
        name: product.title, // Using title (mapped from name)
        price: product.price,
        images: product.images,
        quantity: qty,
        slug: product.slug,
        stock: product.stock, // Using stock (mapped from quantity)
        compareAtPrice: product.compareAtPrice, // For showing original price
      },
    });

    toast.success(
      redirectToCart
        ? "Redirecting to checkout..."
        : "Product added to cart!"
    );

    setQty(1);
    if (redirectToCart) {
      setTimeout(() => {
        router.push("/cart");
      }, 300);
    }

  };

  /* ================= STICKY BAR ================= */
  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= LOADING STATES ================= */
  if (loading) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  /* ================= JSX REMAINS SAME ================= */
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
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map((img: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-24 h-24 rounded-xl cursor-pointer border ${
                    selectedImage === i ? "border-black" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail ${i + 1}`}
                    fill
                    className="object-cover rounded-xl"
                    sizes="96px"
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

            {/* Price Box with Compare Price */}
            <div className="mt-4">
              <p className="text-4xl font-bold text-red-600">
                Rs. {product.price}
              </p>
              {product.compareAtPrice > product.price && (
                <p className="text-gray-500 line-through text-lg">
                  Rs. {product.compareAtPrice}
                </p>
              )}
              <p className="text-gray-600 text-sm mt-1">
                Taxes included.{" "}
                <span className="underline cursor-pointer">
                  Shipping calculated at checkout.
                </span>
              </p>
            </div>

            {/* Stock Indicator */}
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Stock: <span className="font-semibold">{product.stock} available</span>
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQty}
                  disabled={qty <= 1}
                  className="w-10 h-10 bg-gray-200 text-lg rounded flex justify-center items-center disabled:opacity-50"
                >
                  –
                </button>
                <span className="text-lg font-semibold">{qty}</span>
                <button
                  onClick={increaseQty}
                  disabled={qty > MAX_QTY_PER_PRODUCT || qty > product.stock}
                  className="w-10 h-10 bg-gray-200 text-lg rounded flex justify-center items-center disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* OFFER BOX (COMMON OFFER) */}
            {offer && (
              <div className="mt-6 bg-orange-50 border border-orange-200 p-5 rounded-lg">
                <p className="text-red-700 font-bold">{offer.name}</p>
                <div 
                  className="text-gray-800 text-sm prose -mb-9"
                  dangerouslySetInnerHTML={{ __html: offer.description }}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                className="w-full border border-black text-black py-4 rounded text-lg font-medium hover:bg-gray-100"
                onClick={() => handleAddToCart(true)}
                disabled={product.stock <= 0}
              >
                Add to cart
              </button>
              <button
                className="w-full bg-black text-white py-4 rounded text-lg font-semibold hover:bg-gray-900 flex justify-center items-center gap-2"
                onClick={() => handleAddToCart(true)}
                disabled={product.stock <= 0}
              >
                BUY NOW
                <Image src="/images/products/upi.png" width={70} height={20} alt="upi" />
              </button>
            </div>

            {/* Description */}
            <div
              className="mt-10 prose prose-lg prose-gray
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
                lg:scrollbar-track-transparent"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      </section>

      {/* ---------------- Sticky Add to Cart ---------------- */}
      <div
        className={`z-[100] fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg 
          transition-all duration-500 
          ${showSticky ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          {/* LEFT: Image + Title */}
          <div className="flex items-center gap-3 sm:gap-4 w-[65%] sm:w-auto">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src={product.images[0]}
                alt="product"
                fill
                className="object-cover rounded"
                sizes="48px"
              />
            </div>
            <p className="font-medium text-xs sm:text-sm max-w-[180px] sm:max-w-[260px] line-clamp-2">
              {product.title}
            </p>
          </div>
          {/* RIGHT: Button */}
          <button
            className="bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold flex-shrink-0"
            onClick={() => handleAddToCart(true)}
            disabled={product.stock <= 0}
          >
            Add to cart
          </button>
        </div>
      </div>

      <ReviewSection />
      <br />
      <FeaturedCollection
        title="Best Online Store for Herbal Products and Supplements"
        products={herbalProducts}
        viewAllUrl="/collections/herbal"
      />
      <SuggestedProduct />
    </>
  );
}