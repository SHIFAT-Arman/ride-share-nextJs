import Link from "next/link";
import { adminApi } from "@/api/admins";
import { AdminsTable } from "@/components/admins/admins-table";
import { serverAuthConfig } from "@/lib/server-auth";

export default async function AdminsPage() {
  const auth = await serverAuthConfig();

  try {
    const res = await adminApi.getAll({ limit: 100 }, auth);
    return <AdminsTable admins={res.data.data} />;
  } catch {
    return (
      <p className="text-sm text-sky-200/70">
        Could not load admins.{" "}
        <Link href="/portal/admin" className="text-sky-400 underline">
          Try again
        </Link>
      </p>
    );
  }
}
