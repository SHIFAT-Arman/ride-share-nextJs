"use client";

import Link from "next/link";
import GhostFibers from "./GhostFibers";
import TrueFocus from "./TrueFocus";
import { Button } from "./ui/button";
import SpecularButton from "./SpecularButton";

/**
 * Hero = one full screen:
 * 1) GhostFibers fills the background (roads / routes vibe)
 * 2) TrueFocus + short copy + CTA sit on top
 */
export default function Hero() {
  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-[#070b14] text-[#eef3fb]">
      {/* Layer 1: full-bleed animated background */}
      <div className="absolute inset-0" aria-hidden>
        <GhostFibers lineColor="#001242" glowColor="#000022" />
      </div>

      {/* Layer 2: brand + one sentence + one action */}

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-6 px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#eef3fb] text-center">
          Seamless Travels <br /> Fair prices
        </h1>

        <TrueFocus
          sentence="Ride Share"
          borderColor="#0094C6"
          glowColor="rgba(0, 0, 34, 0.55)"
          blurAmount={5}
          animationDuration={0.5}
          pauseBetweenAnimations={1}
        />

        <SpecularButton
          size="lg"
          radius={18}
          tint="#ffffff"
          tintOpacity={0}
          blur={0}
          textColor="#f5f5f5"
          lineColor="#ffffff"
          baseColor="#525252"
          intensity={1}
          shineSize={10}
          shineFade={40}
          thickness={1}
          speed={0.35}
          followMouse
          proximity={250}
          autoAnimate={false}
        >
          <Link href="/book-a-ride">Book a ride</Link>
        </SpecularButton>
      </div>
    </section>
  );
}
