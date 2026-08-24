import { Admin, AdminRole } from "@/types/admin";

interface AdminStatsProps {
  admins: Admin[];
  loading: boolean;
}

interface StatCard {
  label: string;
  value: number;
  color: string;
}

export function AdminStats({ admins, loading }: AdminStatsProps) {
  const stats: StatCard[] = [
    { label: "Total", value: admins.length, color: "text-white" },
    {
      label: "Super Admins",
      value: admins.filter((a) => a.role === AdminRole.SUPER_ADMIN).length,
      color: "text-purple-300",
    },
    {
      label: "Admins",
      value: admins.filter((a) => a.role === AdminRole.ADMIN).length,
      color: "text-indigo-300",
    },
    {
      label: "Support Agents",
      value: admins.filter((a) => a.role === AdminRole.SUPPORT_AGENT).length,
      color: "text-amber-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-white/8 bg-white/3 p-5">
          <p className="text-xs text-white/40 mb-2">{stat.label}</p>
          <p className={`text-2xl font-bold tabular-nums ${stat.color}`}>
            {loading ? <span className="text-white/15">—</span> : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
