import Link from "next/link";
import { riderApi } from "@/api/riders";
import { RidersTable } from "@/components/riders/riders-table";
import { serverAuthConfig } from "@/lib/server-auth";

export default async function AdminRidersPage() {
  const auth = await serverAuthConfig();

  try {
    const res = await riderApi.getAll({ limit: 100 }, auth);
    return <RidersTable riders={res.data.data} />;
  } catch {
    return (
      <p className="text-sm text-sky-200/70">
        Could not load riders.{" "}
        <Link href="/portal/admin/riders" className="text-sky-400 underline">
          Try again
        </Link>
      </p>
    );
  }
}
