"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { zoomFrame, type Box } from "./zoom-frame";

const MOVE_MS = 280;

let dismiss: (() => void) | null = null;

export function ZoomImage({
  src,
  alt,
  priority,
  sizes,
  className,
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<() => void>(() => {});
  const gen = useRef(0);
  const [origin, setOrigin] = useState<Box | null>(null);
  const [grown, setGrown] = useState(false);
  const [motion, setMotion] = useState(true);

  function close() {
    setGrown(false);
    const id = ++gen.current;
    window.setTimeout(() => {
      if (gen.current !== id) return;
      setOrigin(null);
      if (dismiss === closeRef.current) dismiss = null;
    }, motion ? MOVE_MS : 0);
  }

  closeRef.current = close;

  function open() {
    if (origin) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    dismiss?.();
    dismiss = () => closeRef.current();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMotion(!reduce);
    setOrigin({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
    if (reduce) setGrown(true);
    else requestAnimationFrame(() => requestAnimationFrame(() => setGrown(true)));
  }

  useEffect(() => {
    if (!origin) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [origin]);

  const frame = origin
    ? zoomFrame(origin, grown, { w: window.innerWidth, h: window.innerHeight })
    : null;

  return (
    <>
      <button
        type="button"
        ref={ref}
        onClick={open}
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
      >
        <Image
          src={src}
          alt={alt}
          priority={priority}
          sizes={sizes}
          className={origin ? `${className} invisible` : className}
        />
      </button>
      {origin && frame && (
        <>
          <button
            type="button"
            aria-label="Close image"
            className="fixed inset-0 z-50 bg-black/70 transition-opacity duration-300"
            style={{ opacity: grown ? 1 : 0, transitionDuration: motion ? `${MOVE_MS}ms` : "0ms" }}
            onClick={close}
          />
          <div
            className="overflow-hidden rounded-lg"
            style={{
              position: "fixed",
              top: origin.top,
              left: origin.left,
              width: origin.width,
              height: origin.height,
              zIndex: 60,
              transform: `translate(${frame.tx}px, ${frame.ty}px) scale(${frame.scale})`,
              transformOrigin: "center center",
              transition: motion ? `transform ${MOVE_MS}ms ease` : "none",
            }}
          >
            <Image src={src} alt="" fill className="object-cover" sizes={sizes} />
          </div>
        </>
      )}
    </>
  );
}
