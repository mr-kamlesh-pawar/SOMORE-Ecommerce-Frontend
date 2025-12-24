import { Suspense } from "react";
import HeroBannerOne from "@/components/hero/HeroBannerOne";
import TestimonialsSection from "@/components/others/Testimonials";
import Loader from "@/components/others/Loader";
import NewLaunches from "@/components/newLaunches/NewLaunches";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import ShopifyCollection from "../ShopifyCollection/ShopifyCollection";
import RichTextSection from "../RichTextSection/RichTextSection";
import { richTextContent } from "@/data/richTextData";
import { fetchHomeSectionProducts } from "@/lib/product-service";



export const dynamic = "force-dynamic";


export default async function HomePageOne() {
 const newLaunches = await fetchHomeSectionProducts("new-launches", 4);
  const herbalProducts = await fetchHomeSectionProducts("herbal", 8);
  const organicPowders = await fetchHomeSectionProducts("organic-powders", 4);

  console.log("🚀 HOME COUNTS");
  console.log(newLaunches.length);
  console.log(herbalProducts.length);
  console.log(organicPowders.length);

  return (
    <section className="overflow-hidden">

      <HeroBannerOne />

      {/* ================= NEW LAUNCHES ================= */}
      <Suspense fallback={<Loader />}>
        <NewLaunches
          products={newLaunches.map((p:any) => ({
            id: p.$id,
            slug: p.slug,
            title: p.title,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            badge: p.badge,
            images: p.images,
            isHome: true,
          }))}
          viewAllLink="/collections/moringa-products"
        />
      </Suspense>

      {/* ================= HERBAL PRODUCTS ================= */}
      <FeaturedCollection
        title="Best Online Store for Herbal Products and Supplements"
        products={herbalProducts.map((p:any) => ({
          id: p.$id,
          title: p.title,
          url: `/products/${p.slug}`,
          image1: p.images?.[0],
          image2: p.images?.[1],
          badge: p.badge,
          rating: p.ratingAvg,
          ratingCount: p.ratingCount,
          price: `₹${p.price}`,
          compareAtPrice: p.compareAtPrice
            ? `₹${p.compareAtPrice}`
            : undefined,
        }))}
        viewAllUrl="/collections/herbal"
      />

      {/* ================= ORGANIC POWDERS ================= */}
      <ShopifyCollection
        title="Organic Powders"
        products={organicPowders.map((p:any) => ({
          id: p.$id,
          title: p.title,
          url: `/products/${p.slug}`,
          image1: p.images?.[0],
          badge: p.badge,
          rating: p.ratingAvg,
          ratingCount: p.ratingCount,
          price: `₹${p.price}`,
          compareAtPrice: p.compareAtPrice
            ? `₹${p.compareAtPrice}`
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
  );
}
