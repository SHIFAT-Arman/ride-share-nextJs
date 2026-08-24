import { Admin, AdminRole } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function roleBadgeClass(role: AdminRole) {
  switch (role) {
    case AdminRole.SUPER_ADMIN:
      return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    case AdminRole.ADMIN:
      return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
    case AdminRole.SUPPORT_AGENT:
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    default:
      return "bg-white/10 text-white/50 border-white/20";
  }
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-white">{value ?? "—"}</span>
    </div>
  );
}

export function AdminProfileCard({ admin }: { admin: Admin }) {
  const initials = admin.profile
    ? `${admin.profile.firstName[0]}${admin.profile.lastName[0]}`
    : admin.email[0].toUpperCase();

  const name = admin.profile
    ? `${admin.profile.firstName} ${admin.profile.lastName}`
    : "Unknown";

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
      <div className="flex items-center gap-4 mb-6">
        {/*{admin.profile?.profilePictureUrl ? (
          <Image
            src={admin.profile.profilePictureUrl}
            alt={name}
            className="w-16 h-16 rounded-xl object-cover"
            width={16}
            height={16}
          />
        ) : (*/}
        <div className="w-16 h-16 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-300 uppercase">
          {initials}
        </div>
        {/*)}*/}
        <div>
          <h2 className="text-lg font-bold">{name}</h2>
          <Badge className={`mt-1.5 ${roleBadgeClass(admin.role)}`}>
            {admin.role.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <InfoRow label="Email" value={admin.email} />
      <InfoRow label="Age" value={admin.profile?.age} />
      <InfoRow label="Country" value={admin.profile?.country} />
      <InfoRow label="Phone" value={admin.profile?.phoneNumber} />
      <InfoRow label="Joined" value={admin.profile?.joiningDate} />
    </div>
  );
}
