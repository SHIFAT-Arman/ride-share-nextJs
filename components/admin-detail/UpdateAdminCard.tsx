"use client";

import { useState } from "react";
import { adminApi } from "@/api/admins";
import { Admin, AdminRole } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  { value: AdminRole.ADMIN, label: "Admin" },
  { value: AdminRole.SUPER_ADMIN, label: "Super Admin" },
  { value: AdminRole.SUPPORT_AGENT, label: "Support Agent" },
];

export function UpdateAdminCard({ admin }: { admin: Admin }) {
  const [country, setCountry] = useState(admin.profile?.country ?? "");
  const [joiningDate, setJoiningDate] = useState(
    admin.profile?.joiningDate ?? "",
  );
  const [role, setRole] = useState(admin.role);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await adminApi.updateAdmin(admin.id, { country, joiningDate, role });
      setMessage("Admin updated successfully.");
      setIsError(false);
    } catch {
      setMessage("Update failed. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-5">
        Edit Admin
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-white/50 text-xs uppercase tracking-wider">
            Country
          </Label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Bangladesh"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-white/50 text-xs uppercase tracking-wider">
            Joining Date
          </Label>
          <Input
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            className="bg-white/5 border-white/10 text-white h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-white/50 text-xs uppercase tracking-wider">
            Role
          </Label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50"
          >
            {ROLE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value} className="bg-neutral-900">
                {label}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <p
            className={`text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}
          >
            {message}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-0"
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
