import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNestjs,
  SiPostgresql,
  SiDocker,
} from "react-icons/si";
import LogoLoop from "./LogoLoop";

const techLogos = [
  {
    node: <SiReact color="#61DAFB" />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs color="#fff" />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTypescript color="#3178C6" />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss color="#38BDF8" />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiNestjs color="#E0234E" />,
    title: "Nest.js",
    href: "https://nestjs.com",
  },
  {
    node: <SiPostgresql color="#31648C" />,
    title: "PostgreSQL",
    href: "https://www.postgresql.org",
  },
  {
    node: <SiDocker color="#003E52" />,
    title: "Docker",
    href: "https://www.docker.com",
  },
];

export default function LogoSection() {
  return (
    <section
      aria-label="Technology partners"
      className="w-full min-w-0 py-16 px-6 max-w-7xl mx-auto text-white relative overflow-hidden"
    >
      <h2 className="text-3xl font-mono font-bold tracking-tight md:text-3xl lg:text-7xl text-center mb-8">
        Technologies we use
      </h2>
        {/* Basic horizontal loop */}
        <LogoLoop
          logos={techLogos}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut={false}
          ariaLabel="Technologies we use"
          className="h-20 relative w-full overflow-hidden"
      />
    </section>
  );
}
