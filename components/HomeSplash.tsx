"use client";

import { useEffect, useState } from "react";
import InfinityLoop from "@/components/ui/infinityLoop";

const SPLASH_MS = 3000;

export default function HomeSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const id = window.setTimeout(() => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      setVisible(false);
    }, SPLASH_MS);

    return () => {
      window.clearTimeout(id);
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#070b14] text-[#eef3fb]"
      role="status"
      aria-label="Loading"
    >
      <InfinityLoop className="h-12 w-20" />
    </div>
  );
}
