"use client";

import dynamic from "next/dynamic";

const DepthCarousel = dynamic(() => import("./DepthCarousel"), {
  loading: () => <div className="h-full min-h-80 w-full max-w-2xl" />,
});

export default function Features() {
  const images = [
    { image: "/image-carousel/map-1.png", alt: "Map Image" },
    { image: "/image-carousel/map-2.png", alt: "Map Image" },
    { image: "/image-carousel/profile-1.png", alt: "Profile Image" },
    { image: "/image-carousel/register-veh-1.png", alt: "Register Vehicle" },
  ];

  return (
    <section
      aria-label="Why choose us"
      className="grid items-center overflow-hidden w-full max-w-7xl mx-auto gap-10 px-6 py-16 md:grid-cols-2 md:gap-12 md:px-12"
    >
      <div className="text-[#eef3fb]">
        <h2 className="text-3xl font-mono font-bold tracking-tight md:text-3xl lg:text-7xl">
          Modern <br /> Fast, <br /> Reliable
        </h2>
        <p className="mt-4 text-base text-[#eef3fb]/70 md:text-lg">
          Book your next ride — intercity or long distance.
        </p>
      </div>
      <div className="relative max-md:-mx-2 md:h-125">
        <DepthCarousel
          className="w-full max-w-2xl"
          // items={images}
          depth={220}
          spread={90}
          tilt={22}
          tiltDirection="right"
          perspective={1400}
          visibleCards={2}
          falloff={0.2}
          blur={6}
          autoplay={false}
          loop
          cardWidth={500}
          cardHeight={500}
          radius={18}
          tint="#05060a"
          duration={700}
          ease="power3.out"
          // autoplayDelay={3200}
          showControls
          showIndicators
        />
      </div>
    </section>
  );
}
