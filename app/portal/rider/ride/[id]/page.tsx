"use client";

import dynamic from "next/dynamic";

const RiderActiveRidePage = dynamic(() => import("./ride-client"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-sky-200/60">
      Loading map…
    </div>
  ),
});

export default function Page() {
  return <RiderActiveRidePage />;
}
