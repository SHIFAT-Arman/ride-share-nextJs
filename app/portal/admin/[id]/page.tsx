"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminApi } from "@/api/admins";
import type { Admin } from "@/types/admin";
import { AdminDetailCard } from "@/components/admin-detail/admin-detail-card";
import { AdminDetailSkeleton } from "@/components/admin-detail/admin-detail-skeleton";
import { Button } from "@/components/ui/button";

type LoadResult =
  | { ok: true; admin: Admin }
  | { ok: false; error: string };

function fetchAdmin(adminId: string): Promise<LoadResult> {
  return adminApi
    .search({ id: adminId })
    .then((res) => {
      const next = res.data.data[0] ?? null;
      if (!next) return { ok: false as const, error: "Admin not found." };
      return { ok: true as const, admin: next };
    })
    .catch(() => ({
      ok: false as const,
      error: "Could not load admin details.",
    }));
}

export default function AdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const applyResult = (result: LoadResult) => {
    if (result.ok) {
      setAdmin(result.admin);
      setLoadError("");
      return;
    }
    setAdmin(null);
    setLoadError(result.error);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setAdmin(null);
    setLoadError("");
    fetchAdmin(id).then((result) => {
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
          render={<Link href="/portal/admin" />}
          className="mb-6 px-0 text-sky-200/60 hover:text-sky-300"
        >
          Back to admins
        </Button>

        {loading && <AdminDetailSkeleton />}

        {loadError && (
          <div className="py-16 text-center">
            <p className="mb-4 text-sm text-red-400">{loadError}</p>
            <Button
              variant="link"
              nativeButton={false}
              render={<Link href="/portal/admin" />}
              className="text-sky-400 hover:text-sky-300"
            >
              Back to admins
            </Button>
          </div>
        )}

        {admin && (
          <AdminDetailCard
            key={id}
            admin={admin}
            adminId={id}
            onSaved={() => {
              void fetchAdmin(id).then(applyResult);
            }}
          />
        )}
      </main>
    </div>
  );
}
