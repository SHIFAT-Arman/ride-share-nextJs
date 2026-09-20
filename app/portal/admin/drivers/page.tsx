import Link from "next/link";
import { driverApi } from "@/api/drivers";
import { DriversTable } from "@/components/drivers/drivers-table";
import { serverAuthConfig } from "@/lib/server-auth";

export default async function AdminDriversPage() {
  const auth = await serverAuthConfig();

  try {
    const res = await driverApi.getAll({ limit: 100 }, auth);
    return <DriversTable drivers={res.data.data} />;
  } catch {
    return (
      <p className="text-sm text-sky-200/70">
        Could not load drivers.{" "}
        <Link href="/portal/admin/drivers" className="text-sky-400 underline">
          Try again
        </Link>
      </p>
    );
  }
}
