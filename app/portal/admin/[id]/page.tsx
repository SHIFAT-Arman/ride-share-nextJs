"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { adminApi } from "@/api/admins";
import { Admin } from "@/types/admin";
import { AdminProfileCard } from "@/components/admin-detail/AdminProfileCard";
import { UpdateAdminCard } from "@/components/admin-detail/UpdateAdminCard";
import { ProfilePictureCard } from "@/components/admin-detail/ProfilePictureCard";
import { DeleteAdminCard } from "@/components/admin-detail/DeleteAdminCard";
import { AdminDetailSkeleton } from "@/components/admin-detail/AdminDetailSkeleton";

export default function AdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState("");

  const loadAdmin = () => {
    adminApi
      .getById(id)
      .then((res) => setAdmin(res.data))
      .catch(() => setError("Could not load admin details."));
  };

  useEffect(() => {
    loadAdmin();
  }, [id]);

  const adminName = admin ? `${admin.firstName} ${admin.lastName}` : "";

  return (
    <div>
      <main className="mx-auto max-w-4xl">
        <Link
          href="/portal/admin"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs tracking-wider text-sky-200/45 uppercase transition-colors hover:text-sky-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to admins
        </Link>

        {error && (
          <div className="py-24 text-center">
            <p className="mb-4 text-sm text-red-400">{error}</p>
            <Link
              href="/portal/admin"
              className="text-sm text-sky-400 hover:text-sky-300"
            >
              Back to admins
            </Link>
          </div>
        )}

        {!admin && !error && <AdminDetailSkeleton />}

        {admin && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <AdminProfileCard admin={admin} />
            </div>
            <div className="space-y-6">
              <UpdateAdminCard admin={admin} />
              <ProfilePictureCard adminId={admin.id} onSuccess={loadAdmin} />
              <DeleteAdminCard adminId={admin.id} adminName={adminName} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
