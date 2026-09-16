"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/api/auth";
import { driverApi, type Driver } from "@/api/drivers";
import { DriverProfileCard } from "@/components/driver-detail/driver-profile-card";
import { AdminDetailSkeleton } from "@/components/admin-detail/admin-detail-skeleton";

export default function DriverProfilePage() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: session } = await authApi.me();
    if (session.role !== "driver") {
      throw new Error("Not a driver");
    }
    const { data } = await driverApi.getById(session.sub);
    setDriver(data);
    setError("");
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load()
      .catch(() => {
        if (!cancelled) {
          setDriver(null);
          setError("Could not load your profile.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="font-mono text-xs tracking-[0.25em] text-sky-400 uppercase">
          Account
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-sky-50">
          My profile
        </h1>
      </div>

      {loading && <AdminDetailSkeleton />}

      {error && (
        <p className="py-8 text-center text-sm text-red-400">{error}</p>
      )}

      {driver && (
        <DriverProfileCard
          key={driver.id}
          driver={driver}
          onSaved={() => {
            window.dispatchEvent(new Event("portal-profile-updated"));
            void load().catch(() => setError("Could not refresh profile."));
          }}
        />
      )}
    </div>
  );
}
