import { FaDollarSign, FaUserShield, FaChessRook } from "react-icons/fa6";
import { DollarSign, LayoutDashboard, Shield } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const features = [
  {
    title: "Fair price",
    description: "Transparent fares with no hidden fees on every route.",
    icon: <FaDollarSign />,
    image: "https://picsum.photos/seed/fair-price/600/360",
  },
  {
    title: "Secure",
    description: "Verified drivers and encrypted payments on every trip.",
    icon: <FaUserShield />,
    image: "https://picsum.photos/seed/secure/600/360",
  },
  {
    title: "Portal",
    description:
      "One dashboard to book rides, track trips, and manage account.",
    icon: <FaChessRook />,
    image: "https://picsum.photos/seed/portal/600/360",
  },
];

export default function FeatureCards() {
  return (
    <section
      aria-label="Built for you"
      className="w-full max-w-7xl mx-auto px-6 py-16"
    >
      <h2 className="text-3xl font-mono font-bold tracking-tight text-center text-[#eef3fb] md:text-3xl lg:text-7xl mb-10">
        Built for you
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map(({ title, description, icon, image }) => (
          <Card
            key={title}
            className="flex flex-col overflow-hidden border border-white/10 bg-[#0a1020] text-[#eef3fb] shadow-none transition-colors hover:border-[#0094C6]/40"
          >
            <CardHeader>
              <CardTitle className="font-mono font-semibold text-2xl text-[#eef3fb] ">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-[#eef3fb]/70">
                {description}
              </CardDescription>
            </CardContent>
            <div className="relative aspect-5/3 w-full">
              <Image
                src={image}
                alt={`${title} feature`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
