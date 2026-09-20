"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { driverApi, type Driver } from "@/api/drivers";
import { DriverProfileCard } from "@/components/driver-detail/driver-profile-card";
import { Button } from "@/components/ui/button";

type LoadResult =
  | { ok: true; driver: Driver }
  | { ok: false; error: string };

function fetchDriver(id: string): Promise<LoadResult> {
  return driverApi
    .getById(id)
    .then((res) => ({ ok: true as const, driver: res.data }))
    .catch(() => ({
      ok: false as const,
      error: "Could not load driver details.",
    }));
}

export default function AdminDriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const applyResult = (result: LoadResult) => {
    if (result.ok) {
      setDriver(result.driver);
      setLoadError("");
      return;
    }
    setDriver(null);
    setLoadError(result.error);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDriver(null);
    setLoadError("");
    fetchDriver(id).then((result) => {
      if (cancelled) return;
      applyResult(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <main className="mx-auto max-w-4xl">
        <Button
          variant="link"
          nativeButton={false}
          render={<Link href="/portal/admin/drivers" />}
          className="mb-6 px-0 text-sky-200/60 hover:text-sky-300"
        >
          Back to drivers
        </Button>

        {loading && (
          <p className="text-sm text-sky-200/50">Loading driver…</p>
        )}

        {loadError && (
          <div className="py-16 text-center">
            <p className="mb-4 text-sm text-red-400">{loadError}</p>
            <Button
              variant="link"
              nativeButton={false}
              render={<Link href="/portal/admin/drivers" />}
              className="text-sky-400 hover:text-sky-300"
            >
              Back to drivers
            </Button>
          </div>
        )}

        {driver && (
          <DriverProfileCard
            key={id}
            driver={driver}
            canManageStatus
            onSaved={() => {
              void fetchDriver(id).then(applyResult);
            }}
          />
        )}
      </main>
    </div>
  );
}
