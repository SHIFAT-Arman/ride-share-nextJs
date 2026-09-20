"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authApi } from "@/api/auth";
import { riderApi, type Rider } from "@/api/riders";
import { rideApi, type Ride } from "@/api/rides";
import {
  AccountSummaryCard,
  StatusCard,
} from "@/components/portal/summary-cards";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RiderDashboardPage() {
  const [rider, setRider] = useState<Rider | null>(null);
  const [active, setActive] = useState<Ride | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadActive = useCallback(async () => {
    try {
      const { data } = await rideApi.getActive();
      setActive(data);
    } catch {
      setActive(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: session } = await authApi.me();
        if (session.role !== "rider") {
          if (!cancelled) {
            setError("This dashboard is for riders only.");
            setLoading(false);
          }
          return;
        }

        const { data } = await riderApi.getById(session.sub);
        if (cancelled) return;
        setRider(data);
        await loadActive();
      } catch {
        if (!cancelled) setError("Could not load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [loadActive]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-sky-800/50" />
          <Skeleton className="h-8 w-40 bg-sky-800/50" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-40 rounded-xl bg-sky-800/40" />
          <Skeleton className="h-40 rounded-xl bg-sky-800/40" />
        </div>
      </div>
    );
  }

  if (error || !rider) {
    return (
      <p className="text-sm text-sky-200/70">
        {error || "Could not load dashboard."}{" "}
        <Link href="/portal/rider/dashboard" className="text-sky-400 underline">
          Try again
        </Link>
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="font-mono text-xs tracking-[0.25em] text-sky-400 uppercase">
          Rider
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-sky-50">
          Dashboard
        </h1>
      </div>

      {active && (
        <div className="rounded-xl border border-sky-800/60 bg-sky-950/40 p-4">
          <p className="text-xs font-medium tracking-wide text-sky-400 uppercase">
            Active ride · {active.status}
          </p>
          <p className="mt-1 text-sm text-sky-100">
            {active.pickupAddress} → {active.destinationAddress}
          </p>
          <Button
            className="mt-3"
            size="sm"
            render={<Link href={`/portal/rider/ride/${active.id}`} />}
          >
            Track ride
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <StatusCard status={rider.status} />
        <AccountSummaryCard
          firstName={rider.firstName}
          lastName={rider.lastName}
          email={rider.email}
          phone={rider.phone}
        />
      </div>

      <Button render={<Link href="/book-a-ride" />}>Book a ride</Button>
    </div>
  );
}
