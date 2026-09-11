import PixelBlast from "@/components/PixelBlast";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <PixelBlast variant="circle" pixelSize={4} color="#1E91D6" />
      </div>
      <div className="pointer-events-none relative z-10 flex min-h-svh flex-col items-center justify-center gap-4 px-6 pt-24 text-center font-mono">
        <h1 className="text-7xl font-bold tracking-tight">404</h1>
        <p>Page not found.</p>
        <Link href="/" className="pointer-events-auto underline">
          Home
        </Link>
      </div>
    </section>
  );
}
