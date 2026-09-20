"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { riderApi, type Rider } from "@/api/riders";
import { RiderProfileCard } from "@/components/rider-detail/rider-profile-card";
import { Button } from "@/components/ui/button";

type LoadResult =
  | { ok: true; rider: Rider }
  | { ok: false; error: string };

function fetchRider(id: string): Promise<LoadResult> {
  return riderApi
    .getById(id)
    .then((res) => ({ ok: true as const, rider: res.data }))
    .catch(() => ({
      ok: false as const,
      error: "Could not load rider details.",
    }));
}

export default function AdminRiderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rider, setRider] = useState<Rider | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const applyResult = (result: LoadResult) => {
    if (result.ok) {
      setRider(result.rider);
      setLoadError("");
      return;
    }
    setRider(null);
    setLoadError(result.error);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setRider(null);
    setLoadError("");
    fetchRider(id).then((result) => {
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
          render={<Link href="/portal/admin/riders" />}
          className="mb-6 px-0 text-sky-200/60 hover:text-sky-300"
        >
          Back to riders
        </Button>

        {loading && (
          <p className="text-sm text-sky-200/50">Loading rider…</p>
        )}

        {loadError && (
          <div className="py-16 text-center">
            <p className="mb-4 text-sm text-red-400">{loadError}</p>
            <Button
              variant="link"
              nativeButton={false}
              render={<Link href="/portal/admin/riders" />}
              className="text-sky-400 hover:text-sky-300"
            >
              Back to riders
            </Button>
          </div>
        )}

        {rider && (
          <RiderProfileCard
            key={id}
            rider={rider}
            canManageStatus
            onSaved={() => {
              void fetchRider(id).then(applyResult);
            }}
          />
        )}
      </main>
    </div>
  );
}
