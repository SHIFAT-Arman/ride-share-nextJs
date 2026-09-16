"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/api/admins";
import type { Admin } from "@/types/admin";
import { AdminDetailCard } from "@/components/admin-detail/admin-detail-card";
import { AdminDetailSkeleton } from "@/components/admin-detail/admin-detail-skeleton";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () =>
    adminApi
      .me()
      .then(({ data }) => {
        setAdmin(data);
        setError("");
      })
      .catch(() => {
        setAdmin(null);
        setError("Could not load your profile.");
      });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    load().finally(() => {
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

      {admin && (
        <AdminDetailCard
          key={admin.id}
          admin={admin}
          adminId={admin.id}
          onSaved={() => {
            window.dispatchEvent(new Event("portal-profile-updated"));
            void load();
          }}
        />
      )}
    </div>
  );
}
