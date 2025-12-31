// app/(main)/page.tsx
import { Suspense } from "react";
import HeroBannerOne from "@/components/hero/HeroBannerOne";
import TestimonialsSection from "@/components/others/Testimonials";
import Loader from "@/components/others/Loader";
import NewLaunches from "@/components/newLaunches/NewLaunches";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import ShopifyCollection from "../ShopifyCollection/ShopifyCollection";
import RichTextSection from "../RichTextSection/RichTextSection";
import { richTextContent } from "@/data/richTextData";
import { databases, storage } from "@/lib/appwrite";
import { Query } from "appwrite";

// ⚡ ULTIMATE CACHE PREVENTION
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamicParams = true;
export const runtime = 'nodejs'; // Force Node.js runtime for SSR

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;

// ✅ Helper function to convert image IDs to URLs
function getImageUrls(imageIds: string[] | undefined): string[] {
  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    return ["/images/placeholder.png"];
  }
  
  return imageIds.map(fileId => 
    storage.getFileView(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!, fileId)
  );
}

// Define a type for your products
interface AppwriteProduct {
  $id: string;
  name: string;
  slug: string;
  price: number;
  marketprice?: number;
  badge?: string;
  images?: string[];
  homeSection?: string;
  isActive?: boolean;
  category?: string;
  tags?: string[];
  averagerating?: number;
  reviewcount?: number;
  [key: string]: any;
}

// ✅ Fetch all active products WITH CACHE BUSTING
async function getActiveProducts(limit: number): Promise<AppwriteProduct[]> {
  try {
    const timestamp = Date.now(); // Add timestamp to prevent any caching
    console.log(`⏰ Fetch timestamp: ${timestamp}`);
    
    const res = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
      [
        Query.equal("isActive", true),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
        
      ]
    );

    console.log(`🔄 Fresh fetch at ${new Date().toISOString()}: ${res.documents.length} active products`);
    
    // Debug: Show first product's update time
    if (res.documents.length > 0) {
      console.log(`📅 Latest product updated: ${res.documents[0].$updatedAt || res.documents[0].$createdAt}`);
    }

    // Convert image IDs to URLs
    const productsWithImageUrls = res.documents.map((product: any) => ({
      ...product,
      images: getImageUrls(product.images)
    }));

    return productsWithImageUrls;
  } catch (error) {
    console.error(`Error fetching active products:`, error);
    return [];
  }
}

// Add a no-cache header for this specific route
export async function generateMetadata() {
  return {
    other: {
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'pragma': 'no-cache',
      'expires': '0',
    }
  };
}

export default async function HomePageOne() {
  // ✅ Fetch all active products
  const allActiveProducts = await getActiveProducts(20);
  
  // Add timestamp to prevent any component-level caching
  const fetchTime = Date.now();
  console.log(`🏁 Home page rendered at: ${fetchTime}`);
  
  // Categorize them with proper type checking
  const newLaunches = allActiveProducts
    .filter(p => p.homeSection === "new-launches" || !p.homeSection)
    .slice(0, 4);
    
  const herbalProducts = allActiveProducts
    .filter(p => p.homeSection === "herbal" || p.category?.toLowerCase().includes("herbal"))
    .slice(0, 8);
    
  const organicPowders = allActiveProducts
    .filter(p => p.homeSection === "organic-powders" || p.category?.toLowerCase().includes("powder"))
    .slice(0, 4);

  console.log("🔄 FRESH HOME DATA LOADED");
  console.log("New Launches:", newLaunches.length);
  console.log("Herbal Products:", herbalProducts.length);
  console.log("Organic Powders:", organicPowders.length);
  
  // Log actual products for debugging
  console.log("📦 Actual products in newLaunches:", newLaunches.map(p => ({ name: p.name, updated: p.$updatedAt })));

  return (
    <>
      {/* Hidden timestamp to force re-render */}
      <div style={{ display: 'none' }} data-timestamp={fetchTime} />
      
      <section className="overflow-hidden">
        <HeroBannerOne />

        {/* ================= NEW LAUNCHES ================= */}
        <Suspense fallback={<Loader />}>
          <NewLaunches
            key={`new-launches-${fetchTime}`} // Add key to force re-mount
            products={newLaunches.map((p) => ({
              id: p.$id,
              slug: p.slug,
              title: p.name,
              price: p.price,
              compareAtPrice: p.marketprice,
              badge: p.badge,
              images: p.images || ["/images/placeholder.png"],
              isHome: true,
            }))}
            viewAllLink="/collections/moringa-products"
          />
        </Suspense>

        {/* ================= HERBAL PRODUCTS ================= */}
        <FeaturedCollection
          key={`herbal-${fetchTime}`}
          title="Best Online Store for Herbal Products and Supplements"
          products={herbalProducts.map((p) => ({
            id: p.$id,
            title: p.name,
            url: `/products/${p.slug}`,
            image1: p.images?.[0] || "/images/placeholder.png",
            image2: p.images?.[1],
            badge: p.badge,
            rating: p.averagerating,
            ratingCount: p.reviewcount,
            price: `₹${p.price}`,
            compareAtPrice: p.marketprice
              ? `₹${p.marketprice}`
              : undefined,
          }))}
          viewAllUrl="/collections/herbal"
        />

        {/* ================= ORGANIC POWDERS ================= */}
        <ShopifyCollection
          key={`organic-${fetchTime}`}
          title="Organic Powders"
          products={organicPowders.map((p) => ({
            id: p.$id,
            title: p.name,
            url: `/products/${p.slug}`,
            image1: p.images?.[0] || "/images/placeholder.png",
            badge: p.badge,
            rating: p.averagerating,
            ratingCount: p.reviewcount,
            price: `₹${p.price}`,
            compareAtPrice: p.marketprice
              ? `₹${p.marketprice}`
              : undefined,
          }))}
          viewAllUrl="/collections/organic-powders"
        />

        {/* ================= TESTIMONIALS ================= */}
        <TestimonialsSection textCenter={false} />

        {/* ================= RICH TEXT ================= */}
        <RichTextSection
          title={richTextContent.title}
          shortText={richTextContent.shortText}
          longText={richTextContent.longText}
          buttonText={richTextContent.buttonText}
          buttonUrl={richTextContent.buttonUrl}
        />
      </section>
    </>
  );
}