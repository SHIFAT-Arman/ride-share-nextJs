"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authApi } from "@/api/auth";
import { driverApi, type Driver, type DriverRating } from "@/api/drivers";
import { locationApi } from "@/api/location";
import { rideApi, type Ride } from "@/api/rides";
import {
  subscribeDriverRideAssigned,
  type RideAssignedEvent,
} from "@/lib/pusher-client";
import { RatingsCard } from "@/components/portal/ratings-card";
import {
  AccountSummaryCard,
  StatusCard,
} from "@/components/portal/summary-cards";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DriverDashboardPage() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [ratings, setRatings] = useState<DriverRating[]>([]);
  const [active, setActive] = useState<Ride | null>(null);
  const [searching, setSearching] = useState<Ride[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sharingGps, setSharingGps] = useState(false);

  const refreshRides = useCallback(async () => {
    try {
      const [activeRes, searchingRes] = await Promise.all([
        rideApi.getActive(),
        rideApi.getSearching(),
      ]);
      setActive(activeRes.data);
      setSearching(searchingRes.data ?? []);
    } catch {
      /* ignore */
    }
  }, []);

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

        await refreshRides();
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
  }, [refreshRides]);

  useEffect(() => {
    if (!driver?.id) return;
    return subscribeDriverRideAssigned(driver.id, (ev: RideAssignedEvent) => {
      setNotice(`New ride assigned: ${ev.pickupAddress}`);
      void refreshRides();
    });
  }, [driver?.id, refreshRides]);

  // Share GPS while on an active trip (Phase 4)
  useEffect(() => {
    if (!sharingGps && !active) return;
    if (!navigator.geolocation) return;

    const shouldShare =
      sharingGps ||
      active?.status === "ACCEPTED" ||
      active?.status === "IN_PROGRESS";
    if (!shouldShare) return;

    const push = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          void locationApi
            .updateMyLocation(pos.coords.latitude, pos.coords.longitude)
            .catch(() => {});
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 },
      );
    };

    push();
    const t = setInterval(push, 5000);
    return () => clearInterval(t);
  }, [sharingGps, active?.id, active?.status]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      await refreshRides();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Action failed");
    } finally {
      setBusy(false);
    }
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
        <Skeleton className="h-56 rounded-xl bg-sky-800/40" />
      </div>
    );
  }

  if (error && !driver) {
    return (
      <p className="text-sm text-sky-200/70">
        {error}{" "}
        <Link
          href="/portal/driver/dashboard"
          className="text-sky-400 underline"
        >
          Try again
        </Link>
      </p>
    );
  }

  if (!driver) return null;

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

      {notice && (
        <p className="rounded-lg border border-sky-700/50 bg-sky-900/40 px-3 py-2 text-sm text-sky-100">
          {notice}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={sharingGps ? "default" : "outline"}
          onClick={() => setSharingGps((v) => !v)}
        >
          {sharingGps ? "GPS sharing on" : "Go online (share GPS)"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => void refreshRides()}>
          Refresh rides
        </Button>
      </div>

      {active && (
        <div className="space-y-3 rounded-xl border border-sky-800/60 bg-sky-950/40 p-4">
          <p className="text-xs font-medium tracking-wide text-sky-400 uppercase">
            Your ride · {active.status}
          </p>
          <p className="text-sm text-sky-100">
            {active.pickupAddress} → {active.destinationAddress}
          </p>
          {active.estimatedFare != null && (
            <p className="text-sm text-sky-300">Fare ~ ৳{active.estimatedFare}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {active.status === "ACCEPTED" && (
              <Button
                size="sm"
                disabled={busy}
                onClick={() => run(() => rideApi.start(active.id))}
              >
                Start trip
              </Button>
            )}
            {active.status === "IN_PROGRESS" && (
              <Button
                size="sm"
                disabled={busy}
                onClick={() => run(() => rideApi.complete(active.id))}
              >
                Complete trip
              </Button>
            )}
            {(active.status === "ACCEPTED" || active.status === "SEARCHING") && (
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => run(() => rideApi.cancel(active.id))}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      {!active && searching.length > 0 && (
        <div className="space-y-3 rounded-xl border border-sky-800/60 bg-sky-950/40 p-4">
          <p className="text-xs font-medium tracking-wide text-sky-400 uppercase">
            Open requests
          </p>
          <ul className="space-y-3">
            {searching.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 border-b border-sky-900/60 pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="text-sm text-sky-100">
                  <p>
                    {r.pickupAddress} → {r.destinationAddress}
                  </p>
                  <p className="text-sky-400">
                    {r.vehicleType}
                    {r.estimatedFare != null ? ` · ৳${r.estimatedFare}` : ""}
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() => run(() => rideApi.accept(r.id))}
                >
                  Accept
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-red-300">{error}</p>}

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
