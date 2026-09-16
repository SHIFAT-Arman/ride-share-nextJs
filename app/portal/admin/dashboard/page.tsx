import Link from "next/link";
import { adminApi } from "@/api/admins";
import { driverApi } from "@/api/drivers";
import { riderApi } from "@/api/riders";
import { UserCountsPie } from "@/components/portal/user-counts-pie";
import { serverAuthConfig } from "@/lib/server-auth";

export default async function AdminDashboardPage() {
  const auth = await serverAuthConfig();

  try {
    const [admins, riders, drivers] = await Promise.all([
      adminApi.getAll({ limit: 1 }, auth),
      riderApi.getAll({ limit: 1 }, auth),
      driverApi.getAll({ limit: 1 }, auth),
    ]);

    return (
      <UserCountsPie
        counts={{
          admin: admins.data.meta.total,
          rider: riders.data.meta.total,
          driver: drivers.data.meta.total,
        }}
      />
    );
  } catch {
    return (
      <p className="text-sm text-sky-200/70">
        Could not load totals.{" "}
        <Link href="/portal/admin/dashboard" className="text-sky-400 underline">
          Try again
        </Link>
      </p>
    );
  }
}
