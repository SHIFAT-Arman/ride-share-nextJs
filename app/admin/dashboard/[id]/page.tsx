"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { adminApi } from "@/api/admins";
import { Admin } from "@/types/admin";
import { AdminProfileCard } from "@/components/admin-detail/AdminProfileCard";
import { UpdateAdminCard } from "@/components/admin-detail/UpdateAdminCard";
import { ProfilePictureCard } from "@/components/admin-detail/ProfilePictureCard";
import { CreateAnnouncementCard } from "@/components/admin-detail/CreateAnnouncementCard";
import { DeleteAdminCard } from "@/components/admin-detail/DeleteAdminCard";
import { AdminDetailSkeleton } from "@/components/admin-detail/AdminDetailSkeleton";

export default function AdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState("");

  const loadAdmin = () => {
    adminApi
      .getById(id)
      .then((res) => setAdmin(res.data.data[0] ?? null))
      .catch(() => setError("Could not load admin details."));
  };

  useEffect(() => {
    loadAdmin();
  }, [id]);

  const adminName = admin?.profile
    ? `${admin.profile.firstName} ${admin.profile.lastName}`
    : (admin?.email ?? "");

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="flex items-center px-8 py-4 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-widest uppercase text-white/50">
            RideShare Admin
          </span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to administrators
        </Link>

        {/* Error state */}
        {error && (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <Link
              href="/admin/dashboard"
              className="text-indigo-400 text-sm hover:text-indigo-300"
            >
              ← Back to dashboard
            </Link>
          </div>
        )}

        {/* Loading state — skeleton matches the card layout so there is no flash */}
        {!admin && !error && <AdminDetailSkeleton />}

        {/* Loaded state */}
        {admin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AdminProfileCard admin={admin} />
              <CreateAnnouncementCard />
            </div>
            <div className="space-y-6">
              <UpdateAdminCard admin={admin} />
              <ProfilePictureCard
                adminId={admin.profile.id}
                onSuccess={loadAdmin}
              />
              <DeleteAdminCard adminId={admin.id} adminName={adminName} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
