"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authApi } from "@/api/auth";
import { driverApi, type Driver, type DriverRating } from "@/api/drivers";
import { RatingsCard } from "@/components/portal/ratings-card";
import {
  AccountSummaryCard,
  StatusCard,
} from "@/components/portal/summary-cards";
import { Skeleton } from "@/components/ui/skeleton";

export default function DriverDashboardPage() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [ratings, setRatings] = useState<DriverRating[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: session } = await authApi.me();
        if (session.role !== "driver") {
          if (!cancelled) {
            setError("This dashboard is for drivers only.");
            setLoading(false);
          }
          return;
        }

        const { data } = await driverApi.getById(session.sub);
        if (cancelled) return;
        setDriver(data);

        try {
          const ratingsRes = await driverApi.getRatings();
          if (!cancelled) setRatings(ratingsRes.data ?? []);
        } catch {
          if (!cancelled) setRatings([]);
        }
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
  }, []);

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
        <Skeleton className="h-56 rounded-xl bg-sky-800/40" />
      </div>
    );
  }

  if (error || !driver) {
    return (
      <p className="text-sm text-sky-200/70">
        {error || "Could not load dashboard."}{" "}
        <Link
          href="/portal/driver/dashboard"
          className="text-sky-400 underline"
        >
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
          Dashboard
        </h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <StatusCard status={driver.status} />
        <AccountSummaryCard
          firstName={driver.firstName}
          lastName={driver.lastName}
          email={driver.email}
          phone={driver.phone}
        />
      </div>
      <RatingsCard ratings={ratings} />
    </div>
  );
}
