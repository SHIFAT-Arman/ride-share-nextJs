"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/api/auth";
import { riderApi, type Rider } from "@/api/riders";
import { RiderProfileCard } from "@/components/rider-detail/rider-profile-card";
import { AdminDetailSkeleton } from "@/components/admin-detail/admin-detail-skeleton";

export default function RiderProfilePage() {
  const [rider, setRider] = useState<Rider | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: session } = await authApi.me();
    if (session.role !== "rider") {
      throw new Error("Not a rider");
    }
    const { data } = await riderApi.getById(session.sub);
    setRider(data);
    setError("");
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load()
      .catch(() => {
        if (!cancelled) {
          setRider(null);
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

      {rider && (
        <RiderProfileCard
          key={rider.id}
          rider={rider}
          onSaved={() => {
            window.dispatchEvent(new Event("portal-profile-updated"));
            void load().catch(() => setError("Could not refresh profile."));
          }}
        />
      )}
    </div>
  );
}
