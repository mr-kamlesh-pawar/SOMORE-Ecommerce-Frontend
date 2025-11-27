import React, { Suspense } from "react";
import HeroBannerOne from "@/components/hero/HeroBannerOne";
import ProductsCollectionOne from "@/components/products/ProductsCollectionOne";
import NewsLetterTwo from "@/components/newsLetter/NewsLetterTwo";
import LatestBlogPosts from "@/components/blog/LatestBlogPosts";
import CategoriesCollection from "@/components/category/CategoriesCollection";
import TestimonialsSection from "@/components/others/Testimonials";
import BannerOne from "@/components/banners/BannerOne";
import BenefitsSection from "@/components/others/BenefitSection";
import Loader from "@/components/others/Loader";
import AnnouncementBar from "@/components/headers/AnnouncementBar";
import { newLaunchProducts } from "@/data/NewLaunches/newLaunchProducts";
import NewLaunches from "@/components/newLaunches/NewLaunches";
import FeaturedCollection from "@/components/FeaturedCollection/FeaturedCollection";
import { herbalProducts } from "@/data/herbalProducts/herbalProducts";
import ShopifyVideoSection from "@/components/FeaturedCollection/ShopifyVideoSection";
import ShopifyCollection from "../ShopifyCollection/ShopifyCollection";
import { organicPowders } from "@/data/collections/organicPowders";
import RichTextSection from "../RichTextSection/RichTextSection";
import { richTextContent } from "@/data/richTextData";



const HomePageOne = () => {
  return (
    <section className="overflow-hidden">
       
      <HeroBannerOne />
      <Suspense fallback={<Loader />}>
          <NewLaunches
        products={newLaunchProducts}
        viewAllLink="/collections/moringa-products"
      />
      </Suspense>
      <FeaturedCollection
  title="Best Online Store for Herbal Products and Supplements"
  products={herbalProducts}
  viewAllUrl="/collections/herbal"
 />

      
      {/* <ProductsCollectionOne /> */}
      <ShopifyCollection
      title="Organic Powders"
      products={organicPowders}
      viewAllUrl="/collections/organic-powders"
    />
      {/* <BenefitsSection textCenter={false} />
      <BannerOne /> */}

      <TestimonialsSection textCenter={false} />

        <RichTextSection
      title={richTextContent.title}
      shortText={richTextContent.shortText}
      longText={richTextContent.longText}
      buttonText={richTextContent.buttonText}
      buttonUrl={richTextContent.buttonUrl}
    />

       
      {/* <LatestBlogPosts twoColunmHeader={true} />
      <NewsLetterTwo /> */}
    </section>
  );
};

export default HomePageOne;
