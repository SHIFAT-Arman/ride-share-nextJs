"use client";

import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Admin, AdminRole } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminTableProps {
  admins: Admin[];
  loading: boolean;
  error: string;
  onRetry: () => void;
}

function roleBadgeClass(role: AdminRole): string {
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

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminTable({
  admins,
  loading,
  error,
  onRetry,
}: AdminTableProps) {
  const router = useRouter();
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <Button
          onClick={onRetry}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-24 text-center text-white/20 text-sm">
          Loading administrators…
        </div>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-24 text-center">
          <Users className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No administrators found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/8 hover:bg-transparent">
            <TableHead className="text-white/40 text-xs uppercase tracking-wider font-medium px-5">
              Name
            </TableHead>
            <TableHead className="text-white/40 text-xs uppercase tracking-wider font-medium">
              Email
            </TableHead>
            <TableHead className="text-white/40 text-xs uppercase tracking-wider font-medium">
              Role
            </TableHead>
            <TableHead className="text-white/40 text-xs uppercase tracking-wider font-medium hidden sm:table-cell">
              Country
            </TableHead>
            <TableHead className="text-white/40 text-xs uppercase tracking-wider font-medium hidden md:table-cell">
              Joined
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow
              key={admin.id}
              className="border-white/5 hover:bg-white/3 cursor-pointer"
              onClick={() => router.push(`/admin/dashboard/${admin.id}`)}
            >
              <TableCell className="font-medium text-white px-5">
                {admin.profile ? (
                  `${admin.profile.firstName} ${admin.profile.lastName}`
                ) : (
                  <span className="text-white/30 text-xs font-mono">-</span>
                )}
              </TableCell>
              <TableCell className="text-white/55 font-mono text-xs">
                {admin.email}
              </TableCell>
              <TableCell>
                <Badge className={roleBadgeClass(admin.role)}>
                  {admin.role.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-white/40 text-sm hidden sm:table-cell">
                {admin.profile?.country ?? "—"}
              </TableCell>
              <TableCell className="text-white/40 text-sm hidden md:table-cell">
                {formatDate(admin.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
