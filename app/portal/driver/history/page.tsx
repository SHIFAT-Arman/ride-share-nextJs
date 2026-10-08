"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authApi } from "@/api/auth";
import { rideApi, type Ride } from "@/api/rides";
import { RideHistoryList } from "@/components/portal/ride-history-list";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DriverHistoryPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: session } = await authApi.me();
        if (session.role !== "driver") {
          if (!cancelled) {
            setError("This page is for drivers only.");
            setLoading(false);
          }
          return;
        }

        const { data } = await rideApi.getHistory({ limit: 50, offset: 0 });
        if (cancelled) return;
        setRides(data.data);
        setTotal(data.meta.total);
      } catch {
        if (!cancelled) setError("Could not load ride history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-40 bg-sky-800/50" />
        <Skeleton className="h-56 rounded-xl bg-sky-800/40" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-sky-200/70">
        {error}{" "}
        <Link href="/portal/driver/history" className="text-sky-400 underline">
          Try again
        </Link>
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="font-mono text-xs tracking-[0.25em] text-sky-400 uppercase">
          Driver
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-sky-50">
          Ride history
        </h1>
        <p className="mt-1 text-sm text-sky-200/70">
          {total} completed or cancelled trip{total === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-xl border border-sky-800/60 bg-sky-950/40 p-4">
        <RideHistoryList rides={rides} />
      </div>

      <Button
        variant="outline"
        render={<Link href="/portal/driver/dashboard" />}
      >
        Dashboard
      </Button>
    </div>
  );
}
