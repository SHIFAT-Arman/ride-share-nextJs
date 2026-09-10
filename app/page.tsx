import Features from "@/components/features";
import Hero from "@/components/hero";
import LogoSection from "@/components/logoSection";

export default function Home() {
  return (
    <>
      <Hero sloganL1="Seamless Travels" sloganL2="Fair prices" />
      <LogoSection />
      <Features />
    </>
  );
}
