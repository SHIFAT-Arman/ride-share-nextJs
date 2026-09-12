import { Admin } from "@/types/admin";
import { Badge } from "@/components/ui/badge";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex justify-between border-b border-white/5 py-3 last:border-0">
      <span className="text-xs tracking-wider text-sky-200/50 uppercase">
        {label}
      </span>
      <span className="text-sm text-sky-50">{value ?? "—"}</span>
    </div>
  );
}

export function AdminProfileCard({ admin }: { admin: Admin }) {
  const initials = `${admin.firstName[0] ?? ""}${admin.lastName[0] ?? ""}`.toUpperCase();
  const name = `${admin.firstName} ${admin.lastName}`;

  return (
    <div className="rounded-2xl border border-sky-800/40 bg-sky-950/40 p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-sky-700/30 text-xl font-bold text-sky-200 uppercase">
          {initials || "—"}
        </div>
        <div>
          <h2 className="text-lg font-bold text-sky-50">{name}</h2>
          <Badge className="mt-1.5 border-sky-500/30 bg-sky-500/15 text-sky-300">
            {admin.role}
          </Badge>
        </div>
      </div>

      <InfoRow label="Email" value={admin.email} />
      <InfoRow label="Age" value={admin.age} />
      <InfoRow label="Country" value={admin.country} />
      <InfoRow label="Phone" value={admin.phoneNumber} />
      <InfoRow label="Joined" value={admin.joiningDate} />
    </div>
  );
}
