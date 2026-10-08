import Link from "next/link";
import {
  analyticsApi,
  type AnalyticsRange,
} from "@/api/analytics";
import { RatingHealthCard } from "@/components/portal/rating-health-card";
import { RidesOverTimeChart } from "@/components/portal/rides-over-time-chart";
import { StatCard } from "@/components/portal/stat-card";
import { StatusFunnelChart } from "@/components/portal/status-funnel-chart";
import { UserCountsPie } from "@/components/portal/user-counts-pie";
import { VehicleMixChart } from "@/components/portal/vehicle-mix-chart";
import { serverAuthConfig } from "@/lib/server-auth";
import { cn } from "@/lib/utils";

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "all", label: "All" },
];

function parseRange(raw: string | string[] | undefined): AnalyticsRange {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "7d" || value === "30d" || value === "all") return value;
  return "30d";
}

function formatRate(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

function formatGmv(value: number) {
  return `৳${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string | string[] }>;
}) {
  const { range: rawRange } = await searchParams;
  const range = parseRange(rawRange);
  const auth = await serverAuthConfig();

  try {
    const { data } = await analyticsApi.getAdmin({ range }, auth);
    const {
      kpis,
      ridesByDay,
      ridesByStatus,
      vehicleMix,
      ratingHealth,
      accounts,
    } = data;

    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-sky-400 uppercase">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-sky-50">
              Dashboard
            </h1>
          </div>
          <nav className="flex items-center gap-1 font-mono text-xs tracking-wide uppercase">
            {RANGES.map((item) => (
              <Link
                key={item.value}
                href={`/portal/admin/dashboard?range=${item.value}`}
                className={cn(
                  "rounded px-2.5 py-1.5 transition-colors",
                  item.value === range
                    ? "bg-sky-800/60 text-sky-50"
                    : "text-sky-200/70 hover:text-sky-100",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total rides"
            value={kpis.totalRides.toLocaleString()}
          />
          <StatCard
            label="Completion rate"
            value={formatRate(kpis.completionRate)}
          />
          <StatCard
            label="Cancel rate"
            value={formatRate(kpis.cancellationRate)}
          />
          <StatCard label="Est. GMV" value={formatGmv(kpis.estimatedGmv)} />
          <StatCard
            label="Online drivers"
            value={kpis.onlineDrivers.toLocaleString()}
          />
          <StatCard
            label="Searching"
            value={kpis.searchingRides.toLocaleString()}
          />
          <StatCard
            label="Pending drivers"
            value={kpis.pendingDriverVerifications.toLocaleString()}
          />
          <StatCard
            label="Pending riders"
            value={kpis.pendingRiderVerifications.toLocaleString()}
          />
        </div>

        <RidesOverTimeChart data={ridesByDay} />
        <StatusFunnelChart data={ridesByStatus} />
        <div className="grid gap-4 lg:grid-cols-2">
          <VehicleMixChart data={vehicleMix} />
          <RatingHealthCard data={ratingHealth} />
        </div>
        <UserCountsPie counts={accounts} />
      </div>
    );
  } catch {
    return (
      <p className="text-sm text-sky-200/70">
        Could not load dashboard.{" "}
        <Link
          href={`/portal/admin/dashboard?range=${range}`}
          className="text-sky-400 underline"
        >
          Try again
        </Link>
      </p>
    );
  }
}
