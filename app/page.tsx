import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import FeatureCards from "@/components/FeatureCards";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import LogoSection from "@/components/LogoSection";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero sloganL1="Seamless Travels" sloganL2="Fair prices" />
      <LogoSection />
      <Features />
      <FeatureCards />
      <Testimonials />
      <CTA />
      <FAQ />
    </>
  );
}
