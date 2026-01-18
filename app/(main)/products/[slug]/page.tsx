"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { fetchActiveOffer, fetchProductBySlug } from "@/lib/product-service";
import { useCart } from "@/store/hooks/useCart";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import { herbalProducts } from "@/data/herbalProducts/herbalProducts";
import ReviewSection from "@/components/review/ReviewSection";
import SuggestedProduct from "@/components/others/SuggestedProduct";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import Head from "next/head";
import RecommandedProducts from "../RecommandedProducts";

// Helper functions for structured data
const generateProductStructuredData = (product: any) => {
  if (!product) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title || product.name,
    description: product.shortDescription || "",
    image: product.images || [],
    brand: {
      "@type": "Brand",
      name: "Somore Pure",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price.toString(),
      availability: product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      url: typeof window !== 'undefined' 
        ? `${window.location.origin}/products/${product.slug}`
        : `https://yourdomain.com/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Somore Pure",
      },
    },
    ...(product.rating?.stars && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.stars.toString(),
        reviewCount: (product.rating.reviews || 0).toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };
};

const generateBreadcrumbStructuredData = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: typeof window !== 'undefined' 
          ? window.location.origin 
          : "https://yourdomain.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: typeof window !== 'undefined' 
          ? `${window.location.origin}/shop`
          : "https://yourdomain.com/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category || "Products",
        item: typeof window !== 'undefined' 
          ? `${window.location.origin}/shop?category=${product.category}`
          : `https://yourdomain.com/shop?category=${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.title || product.name,
        item: typeof window !== 'undefined' 
          ? window.location.href 
          : `https://yourdomain.com/products/${product.slug}`,
      },
    ],
  };
};

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
  const [imagesLoaded, setImagesLoaded] = useState<number[]>([]);

  /* ================= UPDATE SEO TAGS ================= */
  useEffect(() => {
    if (!product) return;

    // Update document title
    document.title = `${product.title} | Your Store`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    const description = product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Check out this amazing product';
    metaDescription.setAttribute('content', description);
    
    // Update Open Graph tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMetaTag('og:title', product.title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', product.images?.[0] || '/images/placeholder.png');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'product');
    updateMetaTag('product:price:amount', product.price.toString());
    updateMetaTag('product:price:currency', 'INR');
    updateMetaTag('product:availability', product.stock > 0 ? 'in stock' : 'out of stock');
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
    
    // Update Twitter cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', product.title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', product.images?.[0] || '/images/placeholder.png');
    
  }, [product]);

  /* ================= OPTIMIZED DATA LOADING ================= */
  useEffect(() => {
    if (!slug) return;

    const loadProductData = async () => {
      setLoading(true);
      try {
        const productData = await fetchProductBySlug(slug as string);
        
        if (!productData) {
          toast.error("Product not found");
          setLoading(false);
          return;
        }

        const mappedProduct = {
          ...productData,
          title: productData.name,
          descriptionHtml: productData.description + "<br/>" + (productData.consume || ""),
          compareAtPrice: productData.marketprice,
          stock: productData.quantity,
          rating: {
            reviews: productData.reviewcount ?? 0,
            stars: productData.averagerating ?? 0,
          },
          images: productData.images?.length > 0
            ? productData.images
            : ["/images/placeholder.png"],
        };

        setProduct(mappedProduct);
        setLoading(false);

        fetchActiveOffer().then(offerData => {
          setOffer(offerData);
        }).catch(error => {
          console.error("Failed to load offer:", error);
        });

      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
        setLoading(false);
      }
    };

    loadProductData();
  }, [slug]);

  /* ================= MEMOIZED CALCULATIONS ================= */
  const priceInfo = useMemo(() => {
    if (!product) return null;
    return {
      current: product.price,
      original: product.compareAtPrice > product.price ? product.compareAtPrice : null,
      discount: product.compareAtPrice > product.price 
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0
    };
  }, [product]);

  /* ================= IMAGE OPTIMIZATION ================= */
  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => [...prev, index]);
  };

  const placeholderImage = "/images/placeholder.png";

  /* ================= QUANTITY HANDLERS ================= */
  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const increaseQty = () => {
    if (!product) return;

    if (qty >= MAX_QTY_PER_PRODUCT) {
      toast.error("Maximum 7 items allowed per order");
      return;
    }

    if (qty >= product.stock) {
      toast.error("Only limited stock available");
      return;
    }

    setQty(qty + 1);
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (redirectToCart = false) => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (qty >= MAX_QTY_PER_PRODUCT) {
      toast.error("Maximum 7 items allowed per order");
      return;
    }

    if (qty >= product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.$id,
        name: product.title,
        price: product.price,
        images: product.images,
        quantity: qty,
        slug: product.slug,
        stock: product.stock,
        compareAtPrice: product.compareAtPrice,
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

  /* ================= LOADING STATE ================= */
  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-lg font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Generate structured data
  const productStructuredData = generateProductStructuredData(product);
  const breadcrumbStructuredData = generateBreadcrumbStructuredData(product);

  return (
    <>

      {/* Head component for SEO */}
      <Head>
        <title>{product.title} | Your Store</title>
        <meta 
          name="description" 
          content={product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Check out this amazing product'} 
        />
        <meta name="keywords" content={`${product.title}, buy online, natural products`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={product.title} />
        <meta 
          property="og:description" 
          content={product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || ''} 
        />
        <meta property="og:image" content={product.images?.[0] || '/images/placeholder.png'} />
        <meta property="og:url" content={`https://yourdomain.com/products/${product.slug}`} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="INR" />
        <meta property="product:availability" content={product.stock > 0 ? 'in stock' : 'out of stock'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta 
          name="twitter:description" 
          content={product.description?.replace(/<[^>]*>/g, '').substring(0, 160) || ''} 
        />
        <meta name="twitter:image" content={product.images?.[0] || '/images/placeholder.png'} />
        
        {/* Canonical */}
        <link rel="canonical" href={`https://yourdomain.com/products/${product.slug}`} />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        
        {/* Structured Data (JSON-LD) */}
        {productStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(productStructuredData)
            }}
          />
        )}
        
        {breadcrumbStructuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbStructuredData)
            }}
          />
        )}
      </Head>
      
      {/* ---------------- MAIN PRODUCT SECTION ---------------- */}
      <section className="max-w-[1500px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ---------------- LEFT: Optimized Image Gallery ---------------- */}
          <div>
            {/* Main Image with Lazy Loading */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-contain transition-opacity duration-300 border-black p-1 rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={selectedImage === 0} // Only first image is high priority
                loading={selectedImage === 0 ? "eager" : "lazy"}
                onLoadingComplete={() => handleImageLoad(selectedImage)}
              />
            </div>

            {/* Thumbnails with Lazy Loading */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map((img: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-24 h-24 rounded-xl cursor-pointer border flex-shrink-0 transition-all ${
                    selectedImage === i 
                      ? "border-black ring-2 ring-black/10" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" 
                       style={{ opacity: imagesLoaded.includes(i) ? 0 : 1 }} />
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail ${i + 1}`}
                    fill
                    className="object-cover rounded-xl transition-opacity duration-300"
                    sizes="96px"
                    loading="lazy"
                    onLoadingComplete={() => handleImageLoad(i)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- RIGHT: Optimized Product Info ---------------- */}
          <div>
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < Math.floor(product.rating.stars)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm">
                ({product.rating.reviews} reviews)
              </p>
            </div>

            {/* Price Box - Optimized */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-4xl font-bold text-red-600">
                  Rs. {priceInfo?.current}
                </p>
                {priceInfo?.original && (
                  <>
                    <p className="text-gray-500 line-through text-lg">
                      Rs. {priceInfo.original}
                    </p>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                      {priceInfo.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Taxes included. Shipping calculated at checkout.
              </p>
            </div>

            {/* Stock Indicator */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 10 
                  ? "bg-green-100 text-green-800"
                  : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {product.stock > 10 
                  ? "In Stock" 
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"
                }
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <p className="font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQty}
                  disabled={qty <= 1}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-xl rounded-lg flex justify-center items-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <div className="w-16 h-12 border border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-semibold">{qty}</span>
                </div>
                <button
                  onClick={increaseQty}
                  disabled={qty >= MAX_QTY_PER_PRODUCT || qty >= product.stock}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-xl rounded-lg flex justify-center items-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {qty >= MAX_QTY_PER_PRODUCT && (
                <p className="text-red-600 text-sm mt-2">
                  Maximum {MAX_QTY_PER_PRODUCT} items per order
                </p>
              )}
            </div>

            {/* OFFER BOX (COMMON OFFER) */}
            {offer && (
              <div className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎁</span>
                  <p className="text-red-700 font-bold text-lg">{offer.name}</p>
                </div>
                <div 
                  className="text-gray-800 text-sm prose"
                  dangerouslySetInnerHTML={{ __html: offer.description }}
                />
              </div>
            )}

            {/* Optimized Buttons */}
            <div className="mb-10 flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 border-2 border-black text-black py-4 rounded-xl text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleAddToCart(false)}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
              <button
                className="flex-1 bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleAddToCart(true)}
                disabled={product.stock <= 0}
              >
                Buy Now
                <div className="relative w-16 h-5">
                  <Image 
                    src="/images/products/upi.png" 
                    alt="UPI" 
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              </button>
            </div>

            {/* Description - Lazy loaded */}
            <div className="relative">
              <div 
                className="prose prose-lg prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Sticky Add to Cart ---------------- */}
      <div
        className={`z-[100] fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg 
          transition-transform duration-500 ease-in-out
          ${showSticky ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-[1500px] mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover rounded"
                sizes="48px"
                loading="lazy"
              />
            </div>
            <p className="font-medium text-xs sm:text-sm truncate">
              {product.title}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-red-600 text-lg">
                Rs. {priceInfo?.current}
              </p>
              {priceInfo?.original && (
                <p className="text-gray-500 line-through text-sm">
                  Rs. {priceInfo.original}
                </p>
              )}
            </div>
            <button
              className="bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
              onClick={() => handleAddToCart(true)}
              disabled={product.stock <= 0}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {/* Lazy Load These Components */}
      <div className="mt-16">
        <ReviewSection />
      </div>
      <div className="mt-16">
         <RecommandedProducts />
      </div>
      <div className="mt-16">
        <SuggestedProduct />
      </div>
    </>
  );
}

