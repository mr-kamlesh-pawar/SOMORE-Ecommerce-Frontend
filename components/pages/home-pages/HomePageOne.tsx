import HeroBannerOne from "@/components/hero/HeroBannerOne";
import TestimonialsSection from "@/components/others/Testimonials";
import RichTextSection from "../RichTextSection/RichTextSection";
import { richTextContent } from "@/data/richTextData";
import HomeSections from "@/components/hero/HomeSections";

export default function HomePageOne() {
  return (
    <section className="overflow-hidden">
      <HeroBannerOne />
      <HomeSections />
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


      
