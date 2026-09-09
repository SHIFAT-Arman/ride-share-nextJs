// app/admin/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/api/admins";
import { Admin } from "@/types/admin";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardToolbar } from "@/components/dashboard/DashboardToolbar";
import { AdminStats } from "@/components/dashboard/AdminStats";
import { AdminTable } from "@/components/dashboard/AdminTable";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAdmins = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const res = await adminApi.getAll({ limit: 100 }); // hardcoded limit
      const raw = res.data as unknown;
      const list: Admin[] = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as Record<string, unknown>).data)
          ? (raw as { data: Admin[] }).data
          : [];
      setAdmins(list);
    } catch {
      setError("Failed to load admin list. Please try again.");
      // 401 case: already handled — api.ts interceptor redirects
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await adminApi.logout(); // backend clears the cookie server-side
    router.push("/admin/login");
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <DashboardHeader onLogout={handleLogout} />
      <main className="px-8 py-8 max-w-7xl mx-auto">
        <DashboardToolbar
          count={admins.length}
          loading={loading}
          refreshing={refreshing}
          onRefresh={() => fetchAdmins(true)}
        />
        <AdminStats admins={admins} loading={loading} />
        <AdminTable
          admins={admins}
          loading={loading}
          error={error}
          onRetry={() => fetchAdmins()}
        />
      </main>
    </div>
  );
}
