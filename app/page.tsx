import FeatureCards from "@/components/FeatureCards";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import LogoSection from "@/components/LogoSection";

export default function Home() {
  return (
    <>
      <Hero sloganL1="Seamless Travels" sloganL2="Fair prices" />
      <LogoSection />
      <Features />
      <FeatureCards />
    </>
  );
}
