import { testimonialsApi } from "@/api/testimonials";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import FeatureCards from "@/components/FeatureCards";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import HomeSplash from "@/components/HomeSplash";
import LogoSection from "@/components/LogoSection";
import Testimonials, { type TestimonialCard } from "@/components/Testimonials";

export const dynamic = "force-dynamic";

async function loadTestimonials(): Promise<TestimonialCard[]> {
  try {
    const res = await testimonialsApi.list();
    return res.data;
  } catch {
    return [];
  }
}

export default async function Home() {
  const testimonials = await loadTestimonials();

  return (
    <>
      <HomeSplash />
      <Hero sloganL1="Seamless Travels" sloganL2="Fair prices" />
      <LogoSection />
      <Features />
      <FeatureCards />
      <Testimonials testimonials={testimonials} />
      <CTA />
      <FAQ />
    </>
  );
}
