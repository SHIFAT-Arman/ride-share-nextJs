"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Button
      size="icon"
      aria-label="Scroll to top"
      className={`fixed right-6 bottom-6 z-40 cursor-pointer transition-opacity duration-200 ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <ArrowUp aria-hidden />
    </Button>
  );
}
