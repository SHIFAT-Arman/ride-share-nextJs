"use client";

import dynamic from "next/dynamic";

const BookRideMap = dynamic(
  () => import("@/components/book-ride/book-ride-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-sky-200/60">
        Loading map…
      </div>
    ),
  },
);

export default function BookARidePage() {
  return <BookRideMap />;
}
