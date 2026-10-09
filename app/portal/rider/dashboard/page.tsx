"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  analyticsApi,
  type AnalyticsRange,
  type RiderAnalytics,
} from "@/api/analytics";
import { authApi } from "@/api/auth";
import { riderApi, type Rider } from "@/api/riders";
import { rideApi, type Ride } from "@/api/rides";
import { RidesOverTimeChart } from "@/components/portal/rides-over-time-chart";
import { StatCard } from "@/components/portal/stat-card";
import {
  AccountSummaryCard,
  StatusCard,
} from "@/components/portal/summary-cards";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const RANGES: AnalyticsRange[] = ["7d", "30d", "all"];

function fmtMoney(n: number) {
  return `৳${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtKm(n: number | null) {
  if (n == null) return "—";
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;
}

function fmtMin(n: number | null) {
  if (n == null) return "—";
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} min`;
}

export default function RiderDashboardPage() {
  const [rider, setRider] = useState<Rider | null>(null);
  const [active, setActive] = useState<Ride | null>(null);
  const [analytics, setAnalytics] = useState<RiderAnalytics | null>(null);
  const [range, setRange] = useState<AnalyticsRange>("30d");
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

  const loadAnalytics = useCallback(async (r: AnalyticsRange) => {
    try {
      const { data } = await analyticsApi.getMe({ range: r });
      if (data.role === "rider") setAnalytics(data);
      else setAnalytics(null);
    } catch {
      setAnalytics(null);
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

        const [riderRes] = await Promise.all([
          riderApi.getById(session.sub),
          loadAnalytics("30d"),
        ]);
        if (cancelled) return;
        setRider(riderRes.data);
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
  }, [loadActive, loadAnalytics]);

  const onRange = (r: AnalyticsRange) => {
    setRange(r);
    void loadAnalytics(r);
  };

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

  const kpis = analytics?.kpis;
  const mix = analytics?.vehicleMix ?? [];

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

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {RANGES.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={range === r ? "default" : "outline"}
              onClick={() => onRange(r)}
            >
              {r === "all" ? "All" : r}
            </Button>
          ))}
          <Link
            href="/portal/rider/history"
            className="ml-auto text-sm text-sky-400 underline-offset-4 hover:underline"
          >
            View history
          </Link>
        </div>

        {kpis && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Completed" value={kpis.completedRides} />
            <StatCard label="Cancelled" value={kpis.cancelledRides} />
            <StatCard
              label="Est. spend"
              value={fmtMoney(kpis.estimatedSpend)}
            />
            <StatCard
              label="Avg distance"
              value={fmtKm(kpis.avgDistanceKm)}
            />
            <StatCard
              label="Avg duration"
              value={fmtMin(kpis.avgDurationMin)}
            />
          </div>
        )}

        {mix.length > 0 && (
          <p className="text-sm text-sky-200/70">
            Vehicle mix:{" "}
            {mix
              .map((m) => `${m.vehicleType.replaceAll("_", " ")} (${m.count})`)
              .join(" · ")}
          </p>
        )}

        {analytics && <RidesOverTimeChart data={analytics.ridesByDay} />}
      </div>

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
